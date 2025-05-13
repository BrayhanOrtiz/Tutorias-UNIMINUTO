import sql from '../db/connection.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_temporal';

export const login = async (req, res) => {
    const { correo_institucional, contraseña } = req.body;

    try {
        // Primero verificar si el correo existe
        const [usuarioExistente] = await sql`
            SELECT correo_institucional 
            FROM usuario 
            WHERE correo_institucional = ${correo_institucional}
        `;

        if (!usuarioExistente) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no registrado. Por favor, verifique su correo institucional.'
            });
        }

        // Si el correo existe, verificar credenciales
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
                message: 'Contraseña incorrecta. Por favor, intente nuevamente.'
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: usuario.id,
                rol_id: usuario.rol_id,
                correo_institucional: usuario.correo_institucional
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Si las credenciales son correctas, retornar los datos del usuario y el token
        res.status(200).json({
            success: true,
            token,
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