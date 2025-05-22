import sql from '../db/connection.js';

// Obtener todas las encuestas
export const getEncuestas = async (req, res) => {
    try {
        const encuestas = await sql`
            SELECT es.*, 
                   t.fecha_hora_agendada,
                   e.nombre as nombre_estudiante, e.apellido as apellido_estudiante,
                   d.nombre as nombre_docente, d.apellido as apellido_docente
            FROM encuesta_satisfaccion es
            JOIN tutoria t ON es.tutoria_id = t.id
            JOIN usuario e ON t.estudiante_id = e.id
            JOIN usuario d ON t.docente_id = d.id
            ORDER BY es.fecha_respuesta DESC
        `;
        res.json(encuestas);
    } catch (error) {
        console.error('Error al obtener encuestas:', error);
        res.status(500).json({ error: 'Error al obtener las encuestas' });
    }
};

// Obtener una encuesta por ID
export const getEncuestaById = async (req, res) => {
    try {
        const { id } = req.params;
        const encuestas = await sql`
            SELECT es.*, 
                   t.fecha_hora_agendada,
                   e.nombre as nombre_estudiante, e.apellido as apellido_estudiante,
                   d.nombre as nombre_docente, d.apellido as apellido_docente,
                   tm.nombre_tema
            FROM encuesta_satisfaccion es
            JOIN tutoria t ON es.tutoria_id = t.id
            JOIN usuario e ON t.estudiante_id = e.id
            JOIN usuario d ON t.docente_id = d.id
            JOIN tema tm ON t.tema_id = tm.id
            WHERE es.id = ${id}
        `;
        
        if (encuestas.length === 0) {
            return res.status(404).json({ error: 'Encuesta no encontrada' });
        }
        
        res.json(encuestas[0]);
    } catch (error) {
        console.error('Error al obtener encuesta:', error);
        res.status(500).json({ error: 'Error al obtener la encuesta' });
    }
};

// Crear una nueva encuesta
export const createEncuesta = async (req, res) => {
    try {
        const { tutoria_id } = req.body;

        // Validar que la tutoría existe
        const tutoria = await sql`SELECT id FROM tutoria WHERE id = ${tutoria_id}`;
        if (tutoria.length === 0) {
            return res.status(400).json({ error: 'Tutoría no encontrada' });
        }

        // Verificar que no exista ya una encuesta para esta tutoría
        const encuestaExistente = await sql`
            SELECT id FROM encuesta_satisfaccion 
            WHERE tutoria_id = ${tutoria_id}
        `;
        if (encuestaExistente.length > 0) {
            return res.status(400).json({ error: 'Ya existe una encuesta para esta tutoría' });
        }

        const [nuevaEncuesta] = await sql`
            INSERT INTO encuesta_satisfaccion (tutoria_id)
            VALUES (${tutoria_id})
            RETURNING *
        `;

        res.status(201).json(nuevaEncuesta);
    } catch (error) {
        console.error('Error al crear encuesta:', error);
        res.status(500).json({ error: 'Error al crear la encuesta' });
    }
};

// Actualizar una encuesta
export const updateEncuesta = async (req, res) => {
    try {
        const { id } = req.params;
        const { tutoria_id } = req.body;

        // Verificar que la encuesta existe
        const encuestaExistente = await sql`SELECT id FROM encuesta_satisfaccion WHERE id = ${id}`;
        if (encuestaExistente.length === 0) {
            return res.status(404).json({ error: 'Encuesta no encontrada' });
        }

        // Validar que la tutoría existe
        const tutoria = await sql`SELECT id FROM tutoria WHERE id = ${tutoria_id}`;
        if (tutoria.length === 0) {
            return res.status(400).json({ error: 'Tutoría no encontrada' });
        }

        const [encuestaActualizada] = await sql`
            UPDATE encuesta_satisfaccion
            SET tutoria_id = ${tutoria_id}
            WHERE id = ${id}
            RETURNING *
        `;

        res.json(encuestaActualizada);
    } catch (error) {
        console.error('Error al actualizar encuesta:', error);
        res.status(500).json({ error: 'Error al actualizar la encuesta' });
    }
};

// Eliminar una encuesta
export const deleteEncuesta = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que la encuesta existe
        const encuestaExistente = await sql`SELECT id FROM encuesta_satisfaccion WHERE id = ${id}`;
        if (encuestaExistente.length === 0) {
            return res.status(404).json({ error: 'Encuesta no encontrada' });
        }

        // Primero eliminar las respuestas asociadas
        await sql`DELETE FROM respuesta_encuesta WHERE encuesta_satisfaccion_id = ${id}`;
        
        // Luego eliminar la encuesta
        await sql`DELETE FROM encuesta_satisfaccion WHERE id = ${id}`;
        
        res.json({ message: 'Encuesta eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar encuesta:', error);
        res.status(500).json({ error: 'Error al eliminar la encuesta' });
    }
};

// Obtener encuestas por tutoría
export const getEncuestasByTutoria = async (req, res) => {
    try {
        const { tutoriaId } = req.params;
        const encuestas = await sql`
            SELECT es.*, 
                   e.nombre as nombre_estudiante, e.apellido as apellido_estudiante,
                   d.nombre as nombre_docente, d.apellido as apellido_docente,
                   tm.nombre_tema
            FROM encuesta_satisfaccion es
            JOIN tutoria t ON es.tutoria_id = t.id
            JOIN usuario e ON t.estudiante_id = e.id
            JOIN usuario d ON t.docente_id = d.id
            JOIN tema tm ON t.tema_id = tm.id
            WHERE es.tutoria_id = ${tutoriaId}
            ORDER BY es.fecha_respuesta DESC
        `;
        res.json(encuestas);
    } catch (error) {
        console.error('Error al obtener encuestas de la tutoría:', error);
        res.status(500).json({ error: 'Error al obtener las encuestas de la tutoría' });
    }
};

// Obtener respuestas por encuesta
export const getRespuestasByEncuesta = async (req, res) => {
    try {
        const { id } = req.params;
        const respuestas = await sql`
            SELECT re.*, pe.texto_pregunta
            FROM respuesta_encuesta re
            JOIN pregunta_encuesta pe ON re.pregunta_encuesta_id = pe.id
            WHERE re.encuesta_satisfaccion_id = ${id}
            ORDER BY pe.id
        `;
        res.json(respuestas);
    } catch (error) {
        console.error('Error al obtener respuestas de la encuesta:', error);
        res.status(500).json({ error: 'Error al obtener las respuestas de la encuesta' });
    }
}; 