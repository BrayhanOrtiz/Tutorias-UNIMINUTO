import sql from '../db/connection.js';

// Obtener todas las preguntas
export const getPreguntas = async (req, res) => {
    try {
        const preguntas = await sql`
            SELECT * FROM pregunta_encuesta
            ORDER BY id
        `;
        res.json(preguntas);
    } catch (error) {
        console.error('Error al obtener preguntas:', error);
        res.status(500).json({ error: 'Error al obtener las preguntas' });
    }
};

// Obtener una pregunta por ID
export const getPreguntaById = async (req, res) => {
    try {
        const { id } = req.params;
        const preguntas = await sql`
            SELECT * FROM pregunta_encuesta
            WHERE id = ${id}
        `;
        
        if (preguntas.length === 0) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }
        
        res.json(preguntas[0]);
    } catch (error) {
        console.error('Error al obtener pregunta:', error);
        res.status(500).json({ error: 'Error al obtener la pregunta' });
    }
};

// Crear una nueva pregunta
export const createPregunta = async (req, res) => {
    try {
        const { texto_pregunta, tipo_pregunta } = req.body;

        if (!texto_pregunta || texto_pregunta.trim() === '') {
            return res.status(400).json({ error: 'El texto de la pregunta es requerido' });
        }

        if (!tipo_pregunta || !['binaria', 'likert'].includes(tipo_pregunta)) {
            return res.status(400).json({ error: 'El tipo de pregunta debe ser binaria o likert' });
        }

        // Obtener el siguiente ID disponible
        const [maxId] = await sql`
            SELECT COALESCE(MAX(id), 0) + 1 as next_id 
            FROM pregunta_encuesta
        `;

        const [nuevaPregunta] = await sql`
            INSERT INTO pregunta_encuesta (id, texto_pregunta, tipo_pregunta)
            VALUES (${maxId.next_id}, ${texto_pregunta}, ${tipo_pregunta})
            RETURNING *
        `;

        res.status(201).json(nuevaPregunta);
    } catch (error) {
        console.error('Error al crear pregunta:', error);
        res.status(500).json({ error: 'Error al crear la pregunta' });
    }
};

// Actualizar una pregunta
export const updatePregunta = async (req, res) => {
    try {
        const { id } = req.params;
        const { texto_pregunta, tipo_pregunta } = req.body;

        if (!texto_pregunta || texto_pregunta.trim() === '') {
            return res.status(400).json({ error: 'El texto de la pregunta es requerido' });
        }

        if (!tipo_pregunta || !['binaria', 'likert'].includes(tipo_pregunta)) {
            return res.status(400).json({ error: 'El tipo de pregunta debe ser binaria o likert' });
        }

        // Verificar que la pregunta existe
        const preguntaExistente = await sql`SELECT id FROM pregunta_encuesta WHERE id = ${id}`;
        if (preguntaExistente.length === 0) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        const [preguntaActualizada] = await sql`
            UPDATE pregunta_encuesta
            SET texto_pregunta = ${texto_pregunta},
                tipo_pregunta = ${tipo_pregunta}
            WHERE id = ${id}
            RETURNING *
        `;

        res.json(preguntaActualizada);
    } catch (error) {
        console.error('Error al actualizar pregunta:', error);
        res.status(500).json({ error: 'Error al actualizar la pregunta' });
    }
};

// Eliminar una pregunta
export const deletePregunta = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que la pregunta existe
        const preguntaExistente = await sql`SELECT id FROM pregunta_encuesta WHERE id = ${id}`;
        if (preguntaExistente.length === 0) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        // Eliminar las respuestas asociadas
        await sql`DELETE FROM respuesta_encuesta WHERE pregunta_encuesta_id = ${id}`;
        
        // Eliminar la pregunta
        await sql`DELETE FROM pregunta_encuesta WHERE id = ${id}`;
        
        res.json({ message: 'Pregunta eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar pregunta:', error);
        res.status(500).json({ error: 'Error al eliminar la pregunta' });
    }
}; 