import sql from '../db/connection.js';
import nodemailer from 'nodemailer';
import 'dotenv/config';

// Configurar el transporte de correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    debug: true,
    logger: true
});

// Obtener todas las tutorías
export const getTutorias = async (req, res) => {
    try {
        const result = await sql`
            SELECT t.*, 
                   CONCAT(e.nombre, ' ', e.apellido) as nombre_estudiante,
                   CONCAT(d.nombre, ' ', d.apellido) as nombre_docente,
                   tm.nombre_tema as nombre_tema,
                   c.nombre_carrera as carrera_estudiante
            FROM tutoria t
            JOIN usuario e ON t.estudiante_id = e.id
            JOIN usuario d ON t.docente_id = d.id
            JOIN tema tm ON t.tema_id = tm.id
            LEFT JOIN carrera c ON e.carrera_id = c.id
            ORDER BY t.fecha_hora_agendada DESC
        `;
        res.json(result);
    } catch (error) {
        console.error('Error detallado al obtener tutorías:', error);
        res.status(500).json({ 
            error: 'Error al obtener las tutorías',
            detalles: error.message,
            codigo: error.code
        });
    }
};

// Obtener una tutoría por ID
export const getTutoriaById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql`
            SELECT t.*, 
                   CONCAT(e.nombre, ' ', e.apellido) as nombre_estudiante,
                   CONCAT(d.nombre, ' ', d.apellido) as nombre_docente,
                   tm.nombre_tema as nombre_tema,
                   c.nombre_carrera as carrera_estudiante
            FROM tutoria t
            JOIN usuario e ON t.estudiante_id = e.id
            JOIN usuario d ON t.docente_id = d.id
            JOIN tema tm ON t.tema_id = tm.id
            LEFT JOIN carrera c ON e.carrera_id = c.id
            WHERE t.id = ${id}
        `;
        
        if (result.length === 0) {
            return res.status(404).json({ message: 'Tutoría no encontrada' });
        }
        
        res.json(result[0]);
    } catch (error) {
        console.error('Error al obtener tutoría:', error);
        res.status(500).json({ error: 'Error al obtener la tutoría' });
    }
};

// Crear una nueva tutoría
export const createTutoria = async (req, res) => {
    const { 
        estudiante_id, 
        docente_id, 
        tema_id, 
        fecha_hora_agendada,
        hora_inicio_real = null,
        hora_fin_real = null,
        firma_docente_habilitada = false,
        firmada_estudiante = false
    } = req.body;
    
    try {
        // Verificar si existe el estudiante
        const estudiante = await sql`SELECT id, nombre, apellido, correo_institucional FROM usuario WHERE id = ${estudiante_id}`;
        if (estudiante.length === 0) {
            return res.status(400).json({ error: 'El estudiante no existe' });
        }

        // Verificar si existe el docente
        const docente = await sql`SELECT id, nombre, apellido, correo_institucional FROM usuario WHERE id = ${docente_id}`;
        if (docente.length === 0) {
            return res.status(400).json({ error: 'El docente no existe' });
        }

        // Verificar si existe el tema
        const tema = await sql`SELECT id, nombre_tema FROM tema WHERE id = ${tema_id}`;
        if (tema.length === 0) {
            return res.status(400).json({ error: 'El tema no existe' });
        }

        const result = await sql`
            INSERT INTO tutoria (
                estudiante_id,
                docente_id,
                tema_id,
                fecha_hora_agendada,
                hora_inicio_real,
                hora_fin_real,
                firma_docente_habilitada,
                firmada_estudiante
            ) VALUES (
                ${estudiante_id},
                ${docente_id},
                ${tema_id},
                ${fecha_hora_agendada},
                ${hora_inicio_real},
                ${hora_fin_real},
                ${firma_docente_habilitada},
                ${firmada_estudiante}
            ) RETURNING *
        `;

        // Crear notificación para el estudiante
        const fechaFormateada = new Date(fecha_hora_agendada).toLocaleString('es-ES', {
            timeZone: 'America/Bogota',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        try {
            // Crear notificación para el estudiante
            await sql`
                INSERT INTO notificaciones (
                    usuario_id,
                    titulo,
                    mensaje,
                    tipo,
                    enlace,
                    leida,
                    fecha_creacion
                ) VALUES (
                    ${estudiante_id},
                    'Tutoría Agendada Exitosamente',
                    ${`Has agendado una tutoría con el docente ${docente[0].nombre} ${docente[0].apellido} sobre "${tema[0].nombre_tema}" para el ${fechaFormateada}`},
                    'tutoria',
                    '/estudiante/tutorias',
                    false,
                    CURRENT_TIMESTAMP
                )
            `;

            // Crear notificación para el docente
            await sql`
                INSERT INTO notificaciones (
                    usuario_id,
                    titulo,
                    mensaje,
                    tipo,
                    enlace,
                    leida,
                    fecha_creacion
                ) VALUES (
                    ${docente_id},
                    'Nueva Tutoría Agendada',
                    ${`El estudiante ${estudiante[0].nombre} ${estudiante[0].apellido} ha agendado una tutoría sobre "${tema[0].nombre_tema}" para el ${fechaFormateada}`},
                    'tutoria',
                    '/docente/tutorias',
                    false,
                    CURRENT_TIMESTAMP
                )
            `;
        } catch (error) {
            console.error('Error al crear notificaciones:', error);
            // No enviamos error al cliente si falla la creación de notificaciones
        }

        // Enviar correo al docente
        const mailOptions = {
            from: {
                name: 'Tutorias UNIMINUTO',
                address: process.env.EMAIL_USER
            },
            to: docente[0].correo_institucional,
            subject: 'Nueva Tutoría Agendada - Tutorias UNIMINUTO',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #2c3e50; margin: 0;">Nueva Tutoría Agendada</h2>
                        <p style="color: #7f8c8d; margin: 10px 0;">Tutorias UNIMINUTO</p>
                    </div>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                        <p>Hola ${docente[0].nombre} ${docente[0].apellido},</p>
                        <p>Se ha agendado una nueva tutoría con los siguientes detalles:</p>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin-bottom: 10px;"><strong>Estudiante:</strong> ${estudiante[0].nombre} ${estudiante[0].apellido}</li>
                            <li style="margin-bottom: 10px;"><strong>Tema:</strong> ${tema[0].nombre_tema}</li>
                            <li style="margin-bottom: 10px;"><strong>Fecha y Hora:</strong> ${fechaFormateada}</li>
                        </ul>
                        <p>Por favor, asegúrese de estar disponible en el horario indicado.</p>
                    </div>
                    <div style="text-align: center; color: #7f8c8d; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                        <p>© ${new Date().getFullYear()} Tutorias UNIMINUTO</p>
                    </div>
                </div>
            `,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high'
            }
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Correo de notificación enviado al docente');
        } catch (error) {
            console.error('Error al enviar correo de notificación:', error);
            // No enviamos error al cliente si falla el envío del correo
        }

        res.status(201).json(result[0]);
    } catch (error) {
        console.error('Error al crear tutoría:', error);
        res.status(500).json({ error: 'Error al crear la tutoría' });
    }
};

// Actualizar una tutoría
export const updateTutoria = async (req, res) => {
    const { id } = req.params;
    const { 
        estudiante_id, 
        docente_id, 
        tema_id, 
        fecha_hora_agendada,
        hora_inicio_real,
        hora_fin_real,
        firma_docente_habilitada,
        firmada_estudiante
    } = req.body;

    try {
        // Verificar si la tutoría existe
        const tutoriaExistente = await sql`SELECT id FROM tutoria WHERE id = ${id}`;
        if (tutoriaExistente.length === 0) {
            return res.status(404).json({ error: 'Tutoría no encontrada' });
        }

        // Construir el objeto de actualización
        const updateFields = {};
        if (estudiante_id) updateFields.estudiante_id = estudiante_id;
        if (docente_id) updateFields.docente_id = docente_id;
        if (tema_id) updateFields.tema_id = tema_id;
        if (fecha_hora_agendada) updateFields.fecha_hora_agendada = fecha_hora_agendada;
        if (hora_inicio_real !== undefined) updateFields.hora_inicio_real = hora_inicio_real;
        if (hora_fin_real !== undefined) updateFields.hora_fin_real = hora_fin_real;
        if (firma_docente_habilitada !== undefined) updateFields.firma_docente_habilitada = firma_docente_habilitada;
        if (firmada_estudiante !== undefined) updateFields.firmada_estudiante = firmada_estudiante;

        const result = await sql`
            UPDATE tutoria
            SET ${sql(updateFields)}
            WHERE id = ${id}
            RETURNING *
        `;

        res.json(result[0]);
    } catch (error) {
        console.error('Error al actualizar tutoría:', error);
        res.status(500).json({ error: 'Error al actualizar la tutoría' });
    }
};

// Eliminar una tutoría
export const deleteTutoria = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await sql`
            DELETE FROM tutoria
            WHERE id = ${id}
            RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({ error: 'Tutoría no encontrada' });
        }

        res.json({ message: 'Tutoría eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar tutoría:', error);
        res.status(500).json({ error: 'Error al eliminar la tutoría' });
    }
};

// Obtener tutorías por estudiante
export const getTutoriasByEstudiante = async (req, res) => {
    const { estudianteId } = req.params;
    try {
        const result = await sql`
            SELECT t.*, 
                   CONCAT(e.nombre, ' ', e.apellido) as nombre_estudiante,
                   CONCAT(d.nombre, ' ', d.apellido) as nombre_docente,
                   tm.nombre_tema as nombre_tema,
                   c.nombre_carrera as carrera_estudiante
            FROM tutoria t
            JOIN usuario e ON t.estudiante_id = e.id
            JOIN usuario d ON t.docente_id = d.id
            JOIN tema tm ON t.tema_id = tm.id
            LEFT JOIN carrera c ON e.carrera_id = c.id
            WHERE t.estudiante_id = ${estudianteId}
            ORDER BY t.fecha_hora_agendada DESC
        `;
        res.json(result);
    } catch (error) {
        console.error('Error al obtener tutorías del estudiante:', error);
        res.status(500).json({ error: 'Error al obtener las tutorías del estudiante' });
    }
};

// Obtener tutorías por docente
export const getTutoriasByDocente = async (req, res) => {
    const { docenteId } = req.params;
    try {
        const result = await sql`
            SELECT t.*, 
                   CONCAT(e.nombre, ' ', e.apellido) as nombre_estudiante,
                   CONCAT(d.nombre, ' ', d.apellido) as nombre_docente,
                   tm.nombre_tema as nombre_tema,
                   c.nombre_carrera as carrera_estudiante
            FROM tutoria t
            JOIN usuario e ON t.estudiante_id = e.id
            JOIN usuario d ON t.docente_id = d.id
            JOIN tema tm ON t.tema_id = tm.id
            LEFT JOIN carrera c ON e.carrera_id = c.id
            WHERE t.docente_id = ${docenteId}
            ORDER BY t.fecha_hora_agendada DESC
        `;
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error al obtener tutorías del docente:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener las tutorías del docente',
            detalles: error.message
        });
    }
};

// Obtener tutorías por tema
export const getTutoriasByTema = async (req, res) => {
    const { temaId } = req.params;
    try {
        const result = await sql`
            SELECT t.*, 
                   CONCAT(e.nombre, ' ', e.apellido) as nombre_estudiante,
                   CONCAT(d.nombre, ' ', d.apellido) as nombre_docente,
                   tm.nombre_tema as nombre_tema,
                   c.nombre_carrera as carrera_estudiante
            FROM tutoria t
            JOIN usuario e ON t.estudiante_id = e.id
            JOIN usuario d ON t.docente_id = d.id
            JOIN tema tm ON t.tema_id = tm.id
            LEFT JOIN carrera c ON e.carrera_id = c.id
            WHERE t.tema_id = ${temaId}
            ORDER BY t.fecha_hora_agendada DESC
        `;
        res.json(result);
    } catch (error) {
        console.error('Error al obtener tutorías por tema:', error);
        res.status(500).json({ error: 'Error al obtener las tutorías del tema' });
    }
};

// Habilitar firma de tutoría
export const habilitarFirmaTutoria = async (req, res) => {
    const { id } = req.params;
    const { docente_id } = req.body; // ID del docente que está realizando la acción

    try {
        // Verificar si la tutoría existe y pertenece al docente
        const tutoria = await sql`
            SELECT id, docente_id, fecha_hora_agendada, hora_inicio_real
            FROM tutoria 
            WHERE id = ${id}
        `;

        if (tutoria.length === 0) {
            return res.status(404).json({ error: 'Tutoría no encontrada' });
        }

        if (tutoria[0].docente_id !== docente_id) {
            return res.status(403).json({ error: 'No tienes permiso para habilitar la firma de esta tutoría' });
        }

        // Verificar que la tutoría no haya pasado más de 1 hora
        const ahora = new Date();
        const fechaTutoria = new Date(tutoria[0].fecha_hora_agendada);
        const unaHoraDespues = new Date(fechaTutoria.getTime() + 60 * 60 * 1000);
        
        if (ahora > unaHoraDespues) {
            return res.status(400).json({ error: 'No se puede habilitar la firma para una tutoría que ya pasó más de 1 hora' });
        }

        // Habilitar la firma
        const result = await sql`
            UPDATE tutoria
            SET firma_docente_habilitada = true
            WHERE id = ${id}
            RETURNING *
        `;

        // Aquí podríamos agregar la lógica para enviar notificación al estudiante
        // TODO: Implementar sistema de notificaciones

        res.json({
            success: true,
            message: 'Firma habilitada exitosamente',
            data: result[0]
        });
    } catch (error) {
        console.error('Error al habilitar firma:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al habilitar la firma de la tutoría' 
        });
    }
};

// Obtener reportes de tutorías por docente
export const obtenerReportesPorDocente = async (req, res) => {
    const { docenteId } = req.params;

    try {
        console.log('Obteniendo reportes para el docente:', docenteId);
        
        const reportes = await sql`
            SELECT 
                t.id,
                t.fecha_hora_agendada as fecha,
                t.hora_inicio_real as hora_inicio,
                t.hora_fin_real as hora_fin,
                at.observaciones,
                CASE 
                    WHEN at.id IS NULL THEN 'Pendiente'
                    WHEN t.firmada_estudiante = true THEN 'Asistió'
                    ELSE 'No asistió'
                END as estado,
                u.nombre as estudiante_nombre,
                u.apellido as estudiante_apellido,
                tm.nombre_tema as tema,
                t.firmada_estudiante as asistio,
                at.observaciones as observaciones_asistencia
            FROM tutoria t
            LEFT JOIN usuario u ON t.estudiante_id = u.id
            LEFT JOIN tema tm ON t.tema_id = tm.id
            LEFT JOIN asistencia_tutoria at ON t.id = at.tutoria_id
            WHERE t.docente_id = ${docenteId}
            ORDER BY t.fecha_hora_agendada DESC, t.hora_inicio_real DESC;
        `;

        console.log('Reportes encontrados:', reportes.length);

        res.status(200).json({
            success: true,
            data: reportes
        });
    } catch (error) {
        console.error('Error al obtener reportes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los reportes de tutorías',
            error: error.message
        });
    }
}; 