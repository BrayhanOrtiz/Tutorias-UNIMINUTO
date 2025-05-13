import express from 'express';
import { body } from 'express-validator';
import {
  crearUsuarioEstudiante,
  obtenerUsuarios,
  obtenerUsuarioPorId,    // ← importar
  actualizarUsuario,
  crearUsuarioDocente,
  eliminarUsuario,
  obtenerUsuarioActual
} from '../controllers/usuariosController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para gestionar usuarios
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de todos los usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
// Listar todos
router.get('/', obtenerUsuarios);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Usuario no encontrado
 */
// Obtener uno por ID
router.get('/:id', obtenerUsuarioPorId);

/**
 * @swagger
 * /api/usuarios/estudiantes:
 *   post:
 *     summary: Crea un nuevo usuario estudiante
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo_institucional:
 *                 type: string
 *                 format: email
 *               contraseña:
 *                 type: string
 *                 minLength: 6
 *               carrera_id:
 *                 type: integer
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Usuario estudiante creado correctamente
 */
// Crear
// Crear usuario estudiante
router.post(
  '/estudiantes',
  [
    body('id').isInt(),
    body('nombre').isString(),
    body('apellido').isString(),
    body('correo_institucional').isEmail(),
    body('contraseña').isLength({ min: 6 }),
    body('carrera_id').isInt(),
    body('fecha_nacimiento').isISO8601()
  ],
  crearUsuarioEstudiante
);

/**
 * @swagger
 * /api/usuarios/docentes:
 *   post:
 *     summary: Crea un nuevo usuario docente
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo_institucional:
 *                 type: string
 *                 format: email
 *               contraseña:
 *                 type: string
 *                 minLength: 6
 *               carrera_id:
 *                 type: integer
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Usuario docente creado correctamente
 */
// Crear usuario docente
router.post(
  '/docentes',
  [
    body('id').isInt(),
    body('nombre').isString(),
    body('apellido').isString(),
    body('correo_institucional').isEmail(),
    body('contraseña').isLength({ min: 6 }),
    body('carrera_id').isInt(),
    body('fecha_nacimiento').isISO8601()
  ],
  crearUsuarioDocente
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo_institucional:
 *                 type: string
 *                 format: email
 *               contraseña:
 *                 type: string
 *                 minLength: 6
 *               carrera_id:
 *                 type: integer
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *               rol_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
// Actualizar
router.put(
  '/:id',
  [
    body('nombre').optional().isString(),
    body('apellido').optional().isString(),
    body('correo_institucional').optional().isEmail(),
    body('contraseña').optional().isLength({ min: 6 }),
    body('carrera_id').optional().isInt(),
    body('fecha_nacimiento').optional().isISO8601(),
    body('rol_id').optional().isInt()
  ],
  actualizarUsuario
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
// Eliminar
router.delete('/:id', eliminarUsuario);

/**
 * @swagger
 * /api/usuarios/me:
 *   get:
 *     summary: Obtiene la información del usuario actual
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario actual
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
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/me', verifyToken, obtenerUsuarioActual);

export default router;
