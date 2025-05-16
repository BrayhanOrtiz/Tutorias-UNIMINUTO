import sql from '../db/connection.js';

// Obtener todas las tareas
export const getTareas = async (req, res) => {
    try {
        const result = await sql`
            SELECT t.*, 
                   tut.fecha_programada,
                   u_asignador.nombre as nombre_asignador,
                   u_asignador.apellido as apellido_asignador
            FROM tarea_tutoria t
            JOIN tutoria tut ON t.tutoria_id = tut.id
            JOIN usuario u_asignador ON t.asignada_por = u_asignador.id
            ORDER BY t.fecha_creacion DESC
        `;
        res.json(result);
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        res.status(500).json({ mensaje: 'Error al obtener las tareas' });
    }
};

// Obtener una tarea por ID
export const getTareaById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await sql`
            SELECT t.*, 
                   tut.fecha_programada,
                   u_asignador.nombre as nombre_asignador,
                   u_asignador.apellido as apellido_asignador
            FROM tarea_tutoria t
            JOIN tutoria tut ON t.tutoria_id = tut.id
            JOIN usuario u_asignador ON t.asignada_por = u_asignador.id
            WHERE t.id = ${id}
        `;

        if (result.length === 0) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Error al obtener tarea:', error);
        res.status(500).json({ mensaje: 'Error al obtener la tarea' });
    }
};

// Crear una nueva tarea
export const createTarea = async (req, res) => {
    try {
        const { tutoria_id, descripcion, estado, asignada_por, fecha_entrega } = req.body;

        // Validar que la tutoría existe
        const tutoria = await sql`
            SELECT id FROM tutoria WHERE id = ${tutoria_id}
        `;
        if (tutoria.length === 0) {
            return res.status(404).json({ mensaje: 'La tutoría no existe' });
        }

        // Validar que el usuario asignador existe
        const asignador = await sql`
            SELECT id FROM usuario WHERE id = ${asignada_por}
        `;
        if (asignador.length === 0) {
            return res.status(404).json({ mensaje: 'El usuario asignador no existe' });
        }

        const result = await sql`
            INSERT INTO tarea_tutoria (
                tutoria_id, descripcion, estado, 
                asignada_por, fecha_entrega
            ) VALUES (
                ${tutoria_id}, ${descripcion}, ${estado || 'pendiente'}, 
                ${asignada_por}, ${fecha_entrega}
            ) RETURNING *
        `;

        res.status(201).json(result[0]);
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({ mensaje: 'Error al crear la tarea' });
    }
};

// Actualizar una tarea
export const updateTarea = async (req, res) => {
    try {
        const { id } = req.params;
        const { tutoria_id, descripcion, estado, asignada_por, fecha_entrega } = req.body;

        // Validar que la tarea existe
        const tarea = await sql`
            SELECT id FROM tarea_tutoria WHERE id = ${id}
        `;
        if (tarea.length === 0) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        }

        // Si se proporciona tutoria_id, validar que existe
        if (tutoria_id) {
            const tutoria = await sql`
                SELECT id FROM tutoria WHERE id = ${tutoria_id}
            `;
            if (tutoria.length === 0) {
                return res.status(404).json({ mensaje: 'La tutoría no existe' });
            }
        }

        // Si se proporciona asignada_por, validar que existe
        if (asignada_por) {
            const asignador = await sql`
                SELECT id FROM usuario WHERE id = ${asignada_por}
            `;
            if (asignador.length === 0) {
                return res.status(404).json({ mensaje: 'El usuario asignador no existe' });
            }
        }

        const result = await sql`
            UPDATE tarea_tutoria
            SET 
                tutoria_id = COALESCE(${tutoria_id}, tutoria_id),
                descripcion = COALESCE(${descripcion}, descripcion),
                estado = COALESCE(${estado}, estado),
                asignada_por = COALESCE(${asignada_por}, asignada_por),
                fecha_entrega = COALESCE(${fecha_entrega}, fecha_entrega)
            WHERE id = ${id}
            RETURNING *
        `;

        res.json(result[0]);
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({ mensaje: 'Error al actualizar la tarea' });
    }
};

// Eliminar una tarea
export const deleteTarea = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await sql`
            DELETE FROM tarea_tutoria
            WHERE id = ${id}
            RETURNING id
        `;

        if (result.length === 0) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        }

        res.json({ mensaje: 'Tarea eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({ mensaje: 'Error al eliminar la tarea' });
    }
};

// Obtener tareas por tutoría
export const getTareasByTutoria = async (req, res) => {
    try {
        const { tutoriaId } = req.params;

        const result = await sql`
            SELECT t.*, 
                   tut.fecha_programada,
                   u_asignador.nombre as nombre_asignador,
                   u_asignador.apellido as apellido_asignador
            FROM tarea_tutoria t
            JOIN tutoria tut ON t.tutoria_id = tut.id
            JOIN usuario u_asignador ON t.asignada_por = u_asignador.id
            WHERE t.tutoria_id = ${tutoriaId}
            ORDER BY t.fecha_creacion DESC
        `;

        res.json(result);
    } catch (error) {
        console.error('Error al obtener tareas por tutoría:', error);
        res.status(500).json({ mensaje: 'Error al obtener las tareas de la tutoría' });
    }
};

// Obtener tareas por asignador
export const getTareasByAsignador = async (req, res) => {
    try {
        const { asignadorId } = req.params;

        const result = await sql`
            SELECT t.*, 
                   tut.fecha_programada,
                   u_asignador.nombre as nombre_asignador,
                   u_asignador.apellido as apellido_asignador
            FROM tarea_tutoria t
            JOIN tutoria tut ON t.tutoria_id = tut.id
            JOIN usuario u_asignador ON t.asignada_por = u_asignador.id
            WHERE t.asignada_por = ${asignadorId}
            ORDER BY t.fecha_creacion DESC
        `;

        res.json(result);
    } catch (error) {
        console.error('Error al obtener tareas por asignador:', error);
        res.status(500).json({ mensaje: 'Error al obtener las tareas del asignador' });
    }
};

// Obtener tareas por estado
export const getTareasByEstado = async (req, res) => {
    try {
        const { estado } = req.params;

        const result = await sql`
            SELECT t.*, 
                   tut.fecha_programada,
                   u_asignador.nombre as nombre_asignador,
                   u_asignador.apellido as apellido_asignador
            FROM tarea_tutoria t
            JOIN tutoria tut ON t.tutoria_id = tut.id
            JOIN usuario u_asignador ON t.asignada_por = u_asignador.id
            WHERE t.estado = ${estado}
            ORDER BY t.fecha_creacion DESC
        `;

        res.json(result);
    } catch (error) {
        console.error('Error al obtener tareas por estado:', error);
        res.status(500).json({ mensaje: 'Error al obtener las tareas por estado' });
    }
}; 