import sql from '../db/connection.js';

// Obtener todas las asistencias
export const getAsistencias = async (req, res) => {
    try {
        const asistencias = await sql`
            SELECT at.*, 
                   t.fecha_hora_agendada,
                   e.nombre as nombre_estudiante, e.apellido as apellido_estudiante,
                   d.nombre as nombre_docente, d.apellido as apellido_docente,
                   tm.nombre_tema
            FROM asistencia_tutoria at
            JOIN tutoria t ON at.tutoria_id = t.id
            JOIN usuario e ON at.estudiante_id = e.id
            JOIN usuario d ON t.docente_id = d.id
            JOIN tema tm ON t.tema_id = tm.id
            ORDER BY at.fecha_registro DESC
        `;
        res.json(asistencias);
    } catch (error) {
        console.error('Error al obtener asistencias:', error);
        res.status(500).json({ error: 'Error al obtener las asistencias' });
    }
};

// Obtener una asistencia por ID
export const getAsistenciaById = async (req, res) => {
    try {
        const { id } = req.params;
        const asistencias = await sql`
            SELECT at.*, 
                   t.fecha_hora_agendada,
                   e.nombre as nombre_estudiante, e.apellido as apellido_estudiante,
                   d.nombre as nombre_docente, d.apellido as apellido_docente,
                   tm.nombre_tema
            FROM asistencia_tutoria at
            JOIN tutoria t ON at.tutoria_id = t.id
            JOIN usuario e ON at.estudiante_id = e.id
            JOIN usuario d ON t.docente_id = d.id
            JOIN tema tm ON t.tema_id = tm.id
            WHERE at.id = ${id}
        `;
        
        if (asistencias.length === 0) {
            return res.status(404).json({ error: 'Asistencia no encontrada' });
        }
        
        res.json(asistencias[0]);
    } catch (error) {
        console.error('Error al obtener asistencia:', error);
        res.status(500).json({ error: 'Error al obtener la asistencia' });
    }
};

// Crear una nueva asistencia
export const createAsistencia = async (req, res) => {
    try {
        const {
            tutoria_id,
            estudiante_id,
            observaciones
        } = req.body;

      // Validar que la tutoría existe y que el docente habilitó la firma
        const tutoria = await sql`
            SELECT id, hora_inicio_real, firma_docente_habilitada 
            FROM tutoria 
            WHERE id = ${tutoria_id}
        `;
        if (tutoria.length === 0) {
            return res.status(400).json({ error: 'Tutoría no encontrada' });
        }
        if (!tutoria[0].firma_docente_habilitada) {
            return res.status(400).json({ error: 'El docente aún no ha habilitado la firma para esta tutoría.' });
        }


        // Validar que el estudiante existe
        const estudiante = await sql`SELECT id FROM usuario WHERE id = ${estudiante_id}`;
        if (estudiante.length === 0) {
            return res.status(400).json({ error: 'Estudiante no encontrado' });
        }

        // Verificar que no exista ya una asistencia para esta tutoría y estudiante
        const asistenciaExistente = await sql`
            SELECT id FROM asistencia_tutoria 
            WHERE tutoria_id = ${tutoria_id} AND estudiante_id = ${estudiante_id}
        `;
        if (asistenciaExistente.length > 0) {
            return res.status(400).json({ error: 'Ya existe una asistencia registrada para esta tutoría y estudiante' });
        }

        // Insertar la asistencia
        const [nuevaAsistencia] = await sql`
            INSERT INTO asistencia_tutoria (
                tutoria_id,
                estudiante_id,
                observaciones
            )
            VALUES (
                ${tutoria_id},
                ${estudiante_id},
                ${observaciones}
            )
            RETURNING *
        `;

        // Actualizar la tutoría: marcar como firmada por el estudiante
        if (tutoria[0].hora_inicio_real == null) {
            await sql`
                UPDATE tutoria
                SET firmada_estudiante = true,
                    hora_inicio_real = CURRENT_TIMESTAMP
                WHERE id = ${tutoria_id}
            `;
        } else {
            await sql`
                UPDATE tutoria
                SET firmada_estudiante = true
                WHERE id = ${tutoria_id}
            `;
        }

        res.status(201).json(nuevaAsistencia);
    } catch (error) {
        console.error('Error al crear asistencia:', error);
        res.status(500).json({ error: 'Error al crear la asistencia' });
    }
};


// Actualizar una asistencia
export const updateAsistencia = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            tutoria_id,
            estudiante_id,
            observaciones
        } = req.body;

        // Verificar que la asistencia existe
        const asistenciaExistente = await sql`SELECT id FROM asistencia_tutoria WHERE id = ${id}`;
        if (asistenciaExistente.length === 0) {
            return res.status(404).json({ error: 'Asistencia no encontrada' });
        }

        const [asistenciaActualizada] = await sql`
            UPDATE asistencia_tutoria
            SET 
                tutoria_id = ${tutoria_id},
                estudiante_id = ${estudiante_id},
                observaciones = ${observaciones}
            WHERE id = ${id}
            RETURNING *
        `;

        res.json(asistenciaActualizada);
    } catch (error) {
        console.error('Error al actualizar asistencia:', error);
        res.status(500).json({ error: 'Error al actualizar la asistencia' });
    }
};

// Eliminar una asistencia
export const deleteAsistencia = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que la asistencia existe
        const asistenciaExistente = await sql`SELECT id FROM asistencia_tutoria WHERE id = ${id}`;
        if (asistenciaExistente.length === 0) {
            return res.status(404).json({ error: 'Asistencia no encontrada' });
        }

        await sql`DELETE FROM asistencia_tutoria WHERE id = ${id}`;
        res.json({ message: 'Asistencia eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar asistencia:', error);
        res.status(500).json({ error: 'Error al eliminar la asistencia' });
    }
};

// Obtener asistencias por tutoría
export const getAsistenciasByTutoria = async (req, res) => {
    try {
        const { tutoriaId } = req.params;
        const asistencias = await sql`
            SELECT at.*, 
                   e.nombre as nombre_estudiante, e.apellido as apellido_estudiante
            FROM asistencia_tutoria at
            JOIN usuario e ON at.estudiante_id = e.id
            WHERE at.tutoria_id = ${tutoriaId}
            ORDER BY at.fecha_registro DESC
        `;
        res.json(asistencias);
    } catch (error) {
        console.error('Error al obtener asistencias de la tutoría:', error);
        res.status(500).json({ error: 'Error al obtener las asistencias de la tutoría' });
    }
};

// Obtener asistencias por estudiante
export const getAsistenciasByEstudiante = async (req, res) => {
    try {
        const { estudianteId } = req.params;
        const asistencias = await sql`
            SELECT at.*, 
                   t.fecha_hora_agendada,
                   d.nombre as nombre_docente, d.apellido as apellido_docente,
                   tm.nombre_tema
            FROM asistencia_tutoria at
            JOIN tutoria t ON at.tutoria_id = t.id
            JOIN usuario d ON t.docente_id = d.id
            JOIN tema tm ON t.tema_id = tm.id
            WHERE at.estudiante_id = ${estudianteId}
            ORDER BY at.fecha_registro DESC
        `;
        res.json(asistencias);
    } catch (error) {
        console.error('Error al obtener asistencias del estudiante:', error);
        res.status(500).json({ error: 'Error al obtener las asistencias del estudiante' });
    }
}; 