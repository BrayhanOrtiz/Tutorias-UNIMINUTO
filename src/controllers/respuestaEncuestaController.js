import sql from '../db/connection.js';

// Obtener todas las respuestas
export const getRespuestas = async (req, res) => {
    try {
        const respuestas = await sql`
            SELECT re.*, 
                   pe.texto_pregunta,
                   es.tutoria_id,
                   t.fecha_hora_agendada,
                   e.nombre as nombre_estudiante, e.apellido as apellido_estudiante,
                   d.nombre as nombre_docente, d.apellido as apellido_docente
            FROM respuesta_encuesta re
            JOIN pregunta_encuesta pe ON re.pregunta_encuesta_id = pe.id
            JOIN encuesta_satisfaccion es ON re.encuesta_satisfaccion_id = es.id
            JOIN tutoria t ON es.tutoria_id = t.id
            JOIN usuario e ON t.estudiante_id = e.id
            JOIN usuario d ON t.docente_id = d.id
            ORDER BY re.id
        `;
        res.json(respuestas);
    } catch (error) {
        console.error('Error al obtener respuestas:', error);
        res.status(500).json({ error: 'Error al obtener las respuestas' });
    }
};

// Obtener una respuesta por ID
export const getRespuestaById = async (req, res) => {
    try {
        const { id } = req.params;
        const respuestas = await sql`
            SELECT re.*, 
                   pe.texto_pregunta,
                   es.tutoria_id,
                   t.fecha_hora_agendada,
                   e.nombre as nombre_estudiante, e.apellido as apellido_estudiante,
                   d.nombre as nombre_docente, d.apellido as apellido_docente
            FROM respuesta_encuesta re
            JOIN pregunta_encuesta pe ON re.pregunta_encuesta_id = pe.id
            JOIN encuesta_satisfaccion es ON re.encuesta_satisfaccion_id = es.id
            JOIN tutoria t ON es.tutoria_id = t.id
            JOIN usuario e ON t.estudiante_id = e.id
            JOIN usuario d ON t.docente_id = d.id
            WHERE re.id = ${id}
        `;
        
        if (respuestas.length === 0) {
            return res.status(404).json({ error: 'Respuesta no encontrada' });
        }
        
        res.json(respuestas[0]);
    } catch (error) {
        console.error('Error al obtener respuesta:', error);
        res.status(500).json({ error: 'Error al obtener la respuesta' });
    }
};

// Crear una nueva respuesta
export const createRespuesta = async (req, res) => {
    try {
        const {
            encuesta_satisfaccion_id,
            pregunta_encuesta_id,
            respuesta
        } = req.body;

        // Validar que la encuesta existe
        const encuesta = await sql`SELECT id FROM encuesta_satisfaccion WHERE id = ${encuesta_satisfaccion_id}`;
        if (encuesta.length === 0) {
            return res.status(400).json({ error: 'Encuesta no encontrada' });
        }

        // Validar que la pregunta existe
        const pregunta = await sql`SELECT id FROM pregunta_encuesta WHERE id = ${pregunta_encuesta_id}`;
        if (pregunta.length === 0) {
            return res.status(400).json({ error: 'Pregunta no encontrada' });
        }

        // Verificar que no exista ya una respuesta para esta encuesta y pregunta
        const respuestaExistente = await sql`
            SELECT id FROM respuesta_encuesta 
            WHERE encuesta_satisfaccion_id = ${encuesta_satisfaccion_id} 
            AND pregunta_encuesta_id = ${pregunta_encuesta_id}
        `;
        if (respuestaExistente.length > 0) {
            return res.status(400).json({ error: 'Ya existe una respuesta para esta encuesta y pregunta' });
        }

        const [nuevaRespuesta] = await sql`
            INSERT INTO respuesta_encuesta (
                encuesta_satisfaccion_id,
                pregunta_encuesta_id,
                respuesta
            )
            VALUES (
                ${encuesta_satisfaccion_id},
                ${pregunta_encuesta_id},
                ${respuesta}
            )
            RETURNING *
        `;

        res.status(201).json(nuevaRespuesta);
    } catch (error) {
        console.error('Error al crear respuesta:', error);
        res.status(500).json({ error: 'Error al crear la respuesta' });
    }
};

// Actualizar una respuesta
export const updateRespuesta = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            encuesta_satisfaccion_id,
            pregunta_encuesta_id,
            respuesta
        } = req.body;

        // Verificar que la respuesta existe
        const respuestaExistente = await sql`SELECT id FROM respuesta_encuesta WHERE id = ${id}`;
        if (respuestaExistente.length === 0) {
            return res.status(404).json({ error: 'Respuesta no encontrada' });
        }

        // Validar que la encuesta existe
        const encuesta = await sql`SELECT id FROM encuesta_satisfaccion WHERE id = ${encuesta_satisfaccion_id}`;
        if (encuesta.length === 0) {
            return res.status(400).json({ error: 'Encuesta no encontrada' });
        }

        // Validar que la pregunta existe
        const pregunta = await sql`SELECT id FROM pregunta_encuesta WHERE id = ${pregunta_encuesta_id}`;
        if (pregunta.length === 0) {
            return res.status(400).json({ error: 'Pregunta no encontrada' });
        }

        const [respuestaActualizada] = await sql`
            UPDATE respuesta_encuesta
            SET 
                encuesta_satisfaccion_id = ${encuesta_satisfaccion_id},
                pregunta_encuesta_id = ${pregunta_encuesta_id},
                respuesta = ${respuesta}
            WHERE id = ${id}
            RETURNING *
        `;

        res.json(respuestaActualizada);
    } catch (error) {
        console.error('Error al actualizar respuesta:', error);
        res.status(500).json({ error: 'Error al actualizar la respuesta' });
    }
};

// Eliminar una respuesta
export const deleteRespuesta = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que la respuesta existe
        const respuestaExistente = await sql`SELECT id FROM respuesta_encuesta WHERE id = ${id}`;
        if (respuestaExistente.length === 0) {
            return res.status(404).json({ error: 'Respuesta no encontrada' });
        }

        await sql`DELETE FROM respuesta_encuesta WHERE id = ${id}`;
        res.json({ message: 'Respuesta eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar respuesta:', error);
        res.status(500).json({ error: 'Error al eliminar la respuesta' });
    }
};

// Obtener respuestas por encuesta
export const getRespuestasByEncuesta = async (req, res) => {
    try {
        const { encuestaId } = req.params;
        const respuestas = await sql`
            SELECT re.*, pe.texto_pregunta
            FROM respuesta_encuesta re
            JOIN pregunta_encuesta pe ON re.pregunta_encuesta_id = pe.id
            WHERE re.encuesta_satisfaccion_id = ${encuestaId}
            ORDER BY pe.id
        `;
        res.json(respuestas);
    } catch (error) {
        console.error('Error al obtener respuestas de la encuesta:', error);
        res.status(500).json({ error: 'Error al obtener las respuestas de la encuesta' });
    }
};

// Obtener respuestas por pregunta
export const getRespuestasByPregunta = async (req, res) => {
    try {
        const { preguntaId } = req.params;
        const respuestas = await sql`
            SELECT re.*, 
                   es.tutoria_id,
                   t.fecha_hora_agendada,
                   e.nombre as nombre_estudiante, e.apellido as apellido_estudiante,
                   d.nombre as nombre_docente, d.apellido as apellido_docente
            FROM respuesta_encuesta re
            JOIN encuesta_satisfaccion es ON re.encuesta_satisfaccion_id = es.id
            JOIN tutoria t ON es.tutoria_id = t.id
            JOIN usuario e ON t.estudiante_id = e.id
            JOIN usuario d ON t.docente_id = d.id
            WHERE re.pregunta_encuesta_id = ${preguntaId}
            ORDER BY t.fecha_hora_agendada DESC
        `;
        res.json(respuestas);
    } catch (error) {
        console.error('Error al obtener respuestas de la pregunta:', error);
        res.status(500).json({ error: 'Error al obtener las respuestas de la pregunta' });
    }
}; 