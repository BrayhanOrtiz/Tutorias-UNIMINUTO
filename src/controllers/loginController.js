import sql from '../db/connection.js';

export const login = async (req, res) => {
    const { correo_institucional, contraseña } = req.body;

    try {
        // Buscar usuario por correo y contraseña
        const [usuario] = await sql`
            SELECT u.*, ur.rol_id, r.nombre_rol
            FROM usuario u
            LEFT JOIN usuario_rol ur ON u.id = ur.usuario_id
            LEFT JOIN rol r ON ur.rol_id = r.id
            WHERE u.correo_institucional = ${correo_institucional}
            AND u.contraseña = ${contraseña}
        `;

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Si las credenciales son correctas, retornar los datos del usuario
        res.status(200).json({
            success: true,
            data: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo_institucional: usuario.correo_institucional,
                rol_id: usuario.rol_id,
                nombre_rol: usuario.nombre_rol,
                carrera_id: usuario.carrera_id
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error al intentar iniciar sesión'
        });
    }
}; 