import express from 'express';
import {
  obtenerHorarios,
  obtenerHorarioPorId,
  crearHorario,
  actualizarHorario,
  actualizarHorarioEspecifico, 
  eliminarHorario,
  eliminarHorarioEspecifico,
  obtenerHorariosPorUsuario
} from '../controllers/horarioController.js';
import { obtenerHorariosTutorias } from '../controllers/horariosController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   name: Horarios
 *   description: Endpoints para gestionar horarios
 */

/**
 * @swagger
 * /api/horarios/usuario/{usuario_id}/{id}:
 *   delete:
 *     summary: Elimina un horario específico de un usuario
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del horario
 *     responses:
 *       200:
 *         description: Horario eliminado correctamente
 *       404:
 *         description: Horario no encontrado
 */
router.delete('/usuario/:usuario_id/:id', eliminarHorarioEspecifico);

/**
 * @swagger
 * /api/horarios/usuario/{usuario_id}/{id}:
 *   put:
 *     summary: Actualiza un horario específico de un usuario
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del horario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dia:
 *                 type: string
 *               hora_inicio:
 *                 type: string
 *               hora_fin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Horario actualizado correctamente
 *       404:
 *         description: Horario no encontrado
 */
router.put('/usuario/:usuario_id/:id', actualizarHorarioEspecifico);

/**
 * @swagger
 * /api/horarios/usuario/{usuario_id}:
 *   get:
 *     summary: Obtiene todos los horarios de un usuario
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de horarios del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/usuario/:usuario_id', obtenerHorariosPorUsuario);

/**
 * @swagger
 * /api/horarios/tutorias:
 *   get:
 *     summary: Obtener horarios de tutorías de todos los docentes
 *     tags: [Horarios]
 *     responses:
 *       200:
 *         description: Lista de horarios de tutorías
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       dia_semana:
 *                         type: string
 *                       hora_inicio:
 *                         type: string
 *                       hora_fin:
 *                         type: string
 *                       salon:
 *                         type: string
 *                       estado:
 *                         type: string
 *                       nombre_docente:
 *                         type: string
 *                       apellido_docente:
 *                         type: string
 *                       nombre_carrera:
 *                         type: string
 *                       nombre_materia:
 *                         type: string
 */
router.get('/tutorias', obtenerHorariosTutorias);

/**
 * @swagger
 * /api/horarios:
 *   get:
 *     summary: Obtiene todos los horarios
 *     tags: [Horarios]
 *     responses:
 *       200:
 *         description: Lista de todos los horarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', obtenerHorarios);

/**
 * @swagger
 * /api/horarios/{id}:
 *   get:
 *     summary: Obtiene un horario por su ID
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del horario
 *     responses:
 *       200:
 *         description: Horario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Horario no encontrado
 */
router.get('/:id', obtenerHorarioPorId);

/**
 * @swagger
 * /api/horarios:
 *   post:
 *     summary: Crea un nuevo horario
 *     tags: [Horarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dia:
 *                 type: string
 *               hora_inicio:
 *                 type: string
 *               hora_fin:
 *                 type: string
 *     responses:
 *       201:
 *         description: Horario creado correctamente
 */
router.post('/', crearHorario);

/**
 * @swagger
 * /api/horarios/{id}:
 *   put:
 *     summary: Actualiza un horario por su ID
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del horario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dia:
 *                 type: string
 *               hora_inicio:
 *                 type: string
 *               hora_fin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Horario actualizado correctamente
 *       404:
 *         description: Horario no encontrado
 */
router.put('/:id', actualizarHorario);

/**
 * @swagger
 * /api/horarios/{id}:
 *   delete:
 *     summary: Elimina un horario por su ID
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del horario
 *     responses:
 *       200:
 *         description: Horario eliminado correctamente
 *       404:
 *         description: Horario no encontrado
 */
router.delete('/:id', eliminarHorario);

export default router;

