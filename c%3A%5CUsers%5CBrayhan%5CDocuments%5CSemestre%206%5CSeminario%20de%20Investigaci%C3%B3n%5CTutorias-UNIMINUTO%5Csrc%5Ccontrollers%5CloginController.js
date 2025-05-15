// ... existing code ...
import crypto from 'crypto'; // Asegúrate de que esta línea esté presente o agrégala

// ... existing code ...

export const login = async (req, res) => {
// ... existing code ...
};

export const solicitarRecuperacion = async (req, res) => {
    const { correo_institucional } = req.body;

    if (!correo_institucional) {
        return res.status(400).json({ success: false, message: 'El correo institucional es requerido.' });
    }

    try {
        // Verificar si el usuario existe
        const [usuario] = await sql`
            SELECT id, correo_institucional FROM usuario WHERE correo_institucional = ${correo_institucional}
        `;

        if (!usuario) {
            // Por seguridad, no revelar si el correo existe o no.
            // Devolver siempre un mensaje genérico.
            console.log(`Intento de recuperación para correo no existente o error leve: ${correo_institucional}`);
            return res.status(200).json({
                success: true,
                message: 'Si su correo está registrado, recibirá un enlace para restablecer la contraseña.'
            });
        }

        // Generar un token único
        const token = crypto.randomBytes(32).toString('hex');
        // Establecer tiempo de expiración (ej. 1 hora)
        const expires_at = new Date(Date.now() + 60 * 60 * 1000); // 1 hora en milisegundos

        // Guardar el token en la base de datos
        // La siguiente línea es la corrección crucial (alrededor de la línea 93)
        // Nos aseguramos de que la columna 'email' se popule con el correo del usuario.
        // Y también incluimos 'user_id' si tu tabla lo requiere, como sugiere el log de error.
        await sql`
            INSERT INTO password_reset (email, token, expires_at, user_id)
            VALUES (${usuario.correo_institucional}, ${token}, ${expires_at}, ${usuario.id})
        `;

        // Aquí deberías tener la lógica para enviar el correo electrónico con el token.
        // Por ejemplo: await enviarCorreoRecuperacion(usuario.correo_institucional, token);
        // Asegúrate de que esta parte funcione correctamente.

        res.status(200).json({
            success: true,
            message: 'Si su correo está registrado, recibirá un enlace para restablecer la contraseña.'
        });

    } catch (error) {
        console.error('Error en solicitarRecuperacion:', error);
        // Es buena idea verificar el tipo de error para dar mensajes más específicos si es necesario
        if (error.code === '23502' && error.column_name === 'email') {
             return res.status(500).json({
                success: false,
                message: 'Error interno al procesar la solicitud: el correo no se pudo registrar para el reseteo.'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error interno al procesar la solicitud de recuperación.'
        });
    }
};

// ... existing code ...