import sql from '../db/connection.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { addMinutes } from 'date-fns';
import 'dotenv/config';

// Verificar variables de entorno al inicio
console.log('Verificando variables de entorno:', {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS ? '****' : 'no definida',
    FRONTEND_URL: process.env.FRONTEND_URL
});

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
        // Verificar que las variables de entorno estén definidas
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('Las variables de entorno EMAIL_USER y EMAIL_PASS son requeridas');
        }

        // Buscar usuario
        const [usuario] = await sql`SELECT id, correo_institucional FROM usuario WHERE correo_institucional = ${correo_institucional}`;
        if (!usuario) {
            return res.status(200).json({ success: true, message: 'Si el correo existe, se ha enviado un enlace.' });
        }

        // Generar token seguro y expiración
        const token = crypto.randomBytes(32).toString('hex');
        const expires = addMinutes(new Date(), 30);

        // Guardar token y expiración en la base de datos
        await sql`
            INSERT INTO password_reset (usuario_id, email, token, expires_at)
            VALUES (${usuario.id}, ${usuario.correo_institucional}, ${token}, ${expires})
        `;

        // Configurar transporte de correo
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            debug: true,
            logger: true
        });

        // Verificar la conexión
        try {
            console.log('Intentando conectar con:', {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS ? '****' : 'no definida'
            });
            
            await transporter.verify();
            console.log('Conexión SMTP verificada correctamente');
        } catch (error) {
            console.error('Error al verificar la conexión SMTP:', error);
            throw new Error(`Error al verificar la conexión SMTP: ${error.message}`);
        }

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
        
        // Enviar correo
        const info = await transporter.sendMail({
            from: {
                name: 'Tutorias UNIMINUTO',
                address: process.env.EMAIL_USER
            },
            to: correo_institucional,
            subject: 'Recuperación de contraseña - Tutorias UNIMINUTO',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #2c3e50; margin: 0;">Recuperación de Contraseña</h2>
                        <p style="color: #7f8c8d; margin: 10px 0;">Tutorias UNIMINUTO</p>
                    </div>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                        <p>Hola,</p>
                        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
                        <p style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" 
                               style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                                Restablecer Contraseña
                            </a>
                        </p>
                        <p>O copia y pega este enlace en tu navegador:</p>
                        <p style="word-break: break-all; background-color: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 3px;">${resetUrl}</p>
                        <p><strong>Importante:</strong> Este enlace expirará en 30 minutos.</p>
                    </div>
                    <div style="text-align: center; color: #7f8c8d; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
                        <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                        <p>© ${new Date().getFullYear()} Tutorias UNIMINUTO. Todos los derechos reservados.</p>
                    </div>
                </div>
            `,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high'
            }
        });

        console.log('Correo enviado:', info.messageId);
        return res.status(200).json({ success: true, message: 'Si el correo existe, se ha enviado un enlace.' });
    } catch (error) {
        console.error('Error detallado en solicitarRecuperacion:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error al solicitar recuperación.',
            error: error.message 
        });
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