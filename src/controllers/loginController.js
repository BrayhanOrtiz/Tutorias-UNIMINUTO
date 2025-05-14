import sql from '../db/connection.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { addMinutes } from 'date-fns';

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

// Solicitar recuperación de contraseña
export const solicitarRecuperacion = async (req, res) => {
    const { correo_institucional } = req.body;
    try {
        // Buscar usuario
        const [usuario] = await sql`SELECT id, correo_institucional FROM usuario WHERE correo_institucional = ${correo_institucional}`;
        if (!usuario) {
            // Siempre responder igual para no revelar si existe o no
            return res.status(200).json({ success: true, message: 'Si el correo existe, se ha enviado un enlace.' });
        }
        // Generar token seguro y expiración
        const token = crypto.randomBytes(32).toString('hex');
        const expires = addMinutes(new Date(), 30); // 30 minutos
        // Guardar token y expiración en la base de datos (puedes crear una tabla password_reset)
        await sql`
            INSERT INTO password_reset (usuario_id, token, expires_at)
            VALUES (${usuario.id}, ${token}, ${expires})
        `;
        // Configurar transporte de correo (ajusta con tus credenciales reales)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
        await transporter.sendMail({
            from: 'no-reply@uniminuto.edu.co',
            to: correo_institucional,
            subject: 'Recuperación de contraseña',
            html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetUrl}">${resetUrl}</a><p>Este enlace expirará en 30 minutos.</p>`
        });
        return res.status(200).json({ success: true, message: 'Si el correo existe, se ha enviado un enlace.' });
    } catch (error) {
        console.error('Error en solicitarRecuperacion:', error);
        return res.status(500).json({ success: false, message: 'Error al solicitar recuperación.' });
    }
};

// Restablecer contraseña
export const restablecerContrasena = async (req, res) => {
    const { token } = req.params;
    const { correo_institucional, nueva_contraseña } = req.body;
    try {
        // Buscar token válido
        const [reset] = await sql`
            SELECT pr.*, u.id as usuario_id FROM password_reset pr
            JOIN usuario u ON pr.usuario_id = u.id
            WHERE pr.token = ${token} AND pr.expires_at > NOW() AND u.correo_institucional = ${correo_institucional}
        `;
        if (!reset) {
            return res.status(400).json({ success: false, message: 'Token inválido o expirado.' });
        }
        // Actualizar contraseña
        await sql`
            UPDATE usuario SET contraseña = ${nueva_contraseña} WHERE id = ${reset.usuario_id}
        `;
        // Eliminar el token usado
        await sql`DELETE FROM password_reset WHERE token = ${token}`;
        return res.status(200).json({ success: true, message: 'Contraseña restablecida correctamente.' });
    } catch (error) {
        console.error('Error en restablecerContrasena:', error);
        return res.status(500).json({ success: false, message: 'Error al restablecer la contraseña.' });
    }
}; 