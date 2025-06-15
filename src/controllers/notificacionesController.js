import sql from '../db/connection.js';

// Obtener notificaciones de un usuario
export const getNotificaciones = async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const result = await sql`
            SELECT * FROM notificaciones 
            WHERE usuario_id = ${usuarioId}
            ORDER BY fecha_creacion DESC
            LIMIT 50
        `;
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener las notificaciones'
        });
    }
};

// Crear una nueva notificación
export const createNotificacion = async (req, res) => {
    const { usuario_id, titulo, mensaje, tipo, enlace } = req.body;
    try {
        const result = await sql`
            INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, enlace)
            VALUES (${usuario_id}, ${titulo}, ${mensaje}, ${tipo}, ${enlace})
            RETURNING *
        `;
        res.status(201).json({
            success: true,
            data: result[0]
        });
    } catch (error) {
        console.error('Error al crear notificación:', error);
        res.status(500).json({
            success: false,
            error: 'Error al crear la notificación'
        });
    }
};

// Marcar notificación como leída
export const marcarComoLeida = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql`
            UPDATE notificaciones
            SET leida = true, fecha_lectura = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Notificación no encontrada'
            });
        }
        res.json({
            success: true,
            data: result[0]
        });
    } catch (error) {
        console.error('Error al marcar notificación como leída:', error);
        res.status(500).json({
            success: false,
            error: 'Error al marcar la notificación como leída'
        });
    }
};

// Marcar todas las notificaciones como leídas
export const marcarTodasComoLeidas = async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const result = await sql`
            UPDATE notificaciones
            SET leida = true, fecha_lectura = CURRENT_TIMESTAMP
            WHERE usuario_id = ${usuarioId} AND leida = false
            RETURNING *
        `;
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error al marcar notificaciones como leídas:', error);
        res.status(500).json({
            success: false,
            error: 'Error al marcar las notificaciones como leídas'
        });
    }
};

// Obtener contador de notificaciones no leídas
export const getContadorNoLeidas = async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const result = await sql`
            SELECT COUNT(*) as total
            FROM notificaciones
            WHERE usuario_id = ${usuarioId} AND leida = false
        `;
        res.json({
            success: true,
            data: result[0].total
        });
    } catch (error) {
        console.error('Error al obtener contador de notificaciones:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener el contador de notificaciones'
        });
    }
};

// Eliminar una notificación
export const deleteNotificacion = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql`
            DELETE FROM notificaciones
            WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Notificación no encontrada'
            });
        }
        res.json({
            success: true,
            message: 'Notificación eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar notificación:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar la notificación'
        });
    }
}; 