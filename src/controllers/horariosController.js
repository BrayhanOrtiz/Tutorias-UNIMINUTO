import sql from '../db/connection.js';

// Obtener horarios de tutorías de todos los docentes
export const obtenerHorariosTutorias = async (req, res) => {
    try {
        const horarios = await sql`
            SELECT 
                h.id,
                h.dia_semana,
                h.hora_inicio,
                h.hora_fin,
                h.salon,
                u.nombre as nombre_docente,
                u.apellido as apellido_docente,
                c.nombre_carrera as nombre_carrera
            FROM horario h
            JOIN usuario u ON h.usuario_id = u.id
            JOIN usuario_rol ur ON u.id = ur.usuario_id
            JOIN carrera c ON u.carrera_id = c.id
            WHERE ur.rol_id = 2  -- Solo docentes
            ORDER BY 
                CASE h.dia_semana
                    WHEN 'Lunes' THEN 1
                    WHEN 'Martes' THEN 2
                    WHEN 'Miércoles' THEN 3
                    WHEN 'Jueves' THEN 4
                    WHEN 'Viernes' THEN 5
                    WHEN 'Sábado' THEN 6
                END,
                h.hora_inicio
        `;

        res.status(200).json({
            success: true,
            data: horarios
        });
    } catch (error) {
        console.error('Error al obtener horarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los horarios de tutorías'
        });
    }
}; 