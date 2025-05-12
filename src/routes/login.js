import express from 'express';
import { body } from 'express-validator';
import { login } from '../controllers/loginController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para la autenticación de usuarios
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Iniciar sesión en el sistema
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo_institucional
 *               - contraseña
 *             properties:
 *               correo_institucional:
 *                 type: string
 *                 format: email
 *                 description: Correo institucional del usuario
 *               contraseña:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     apellido:
 *                       type: string
 *                     correo_institucional:
 *                       type: string
 *                     rol_id:
 *                       type: integer
 *                     nombre_rol:
 *                       type: string
 *                     carrera_id:
 *                       type: integer
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error del servidor
 */
router.post('/',
    [
        body('correo_institucional').isEmail().withMessage('El correo institucional debe ser válido'),
        body('contraseña').notEmpty().withMessage('La contraseña es requerida')
    ],
    login
);

export default router; 