import sql from '../db/connection.js';

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
        const estudiante = await sql`SELECT id FROM usuario WHERE id = ${estudiante_id}`;
        if (estudiante.length === 0) {
            return res.status(400).json({ error: 'El estudiante no existe' });
        }

        // Verificar si existe el docente
        const docente = await sql`SELECT id FROM usuario WHERE id = ${docente_id}`;
        if (docente.length === 0) {
            return res.status(400).json({ error: 'El docente no existe' });
        }

        // Verificar si existe el tema
        const tema = await sql`SELECT id FROM tema WHERE id = ${tema_id}`;
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
        res.json(result);
    } catch (error) {
        console.error('Error al obtener tutorías del docente:', error);
        res.status(500).json({ error: 'Error al obtener las tutorías del docente' });
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