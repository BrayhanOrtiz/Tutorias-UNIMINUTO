import express from 'express';
import {
    getAsistencias,
    getAsistenciaById,
    createAsistencia,
    updateAsistencia,
    deleteAsistencia,
    getAsistenciasByTutoria,
    getAsistenciasByEstudiante
} from '../controllers/asistenciaTutoriaController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AsistenciaTutoria:
 *       type: object
 *       required:
 *         - tutoria_id
 *         - estudiante_id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la asistencia
 *         tutoria_id:
 *           type: integer
 *           description: ID de la tutoría
 *         estudiante_id:
 *           type: integer
 *           description: ID del estudiante
 *         observaciones:
 *           type: string
 *           description: Observaciones sobre la asistencia
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del registro
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje de error
 *         detalles:
 *           type: string
 *           description: Detalles adicionales del error
 *         codigo:
 *           type: string
 *           description: Código de error
 */

/**
 * @swagger
 * tags:
 *   name: Asistencias
 *   description: API para la gestión de asistencias a tutorías
 */

/**
 * @swagger
 * /api/asistencia-tutoria:
 *   get:
 *     summary: Obtener todas las asistencias
 *     tags: [Asistencias]
 *     responses:
 *       200:
 *         description: Lista de asistencias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AsistenciaTutoria'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAsistencias);

/**
 * @swagger
 * /api/asistencia-tutoria/{id}:
 *   get:
 *     summary: Obtener una asistencia por ID
 *     tags: [Asistencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asistencia
 *     responses:
 *       200:
 *         description: Asistencia encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsistenciaTutoria'
 *       404:
 *         description: Asistencia no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getAsistenciaById);

/**
 * @swagger
 * /api/asistencia-tutoria:
 *   post:
 *     summary: Crear una nueva asistencia
 *     tags: [Asistencias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AsistenciaTutoria'
 *     responses:
 *       201:
 *         description: Asistencia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsistenciaTutoria'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createAsistencia);

/**
 * @swagger
 * /api/asistencia-tutoria/{id}:
 *   put:
 *     summary: Actualizar una asistencia
 *     tags: [Asistencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asistencia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AsistenciaTutoria'
 *     responses:
 *       200:
 *         description: Asistencia actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsistenciaTutoria'
 *       404:
 *         description: Asistencia no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', updateAsistencia);

/**
 * @swagger
 * /api/asistencia-tutoria/{id}:
 *   delete:
 *     summary: Eliminar una asistencia
 *     tags: [Asistencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asistencia
 *     responses:
 *       200:
 *         description: Asistencia eliminada exitosamente
 *       404:
 *         description: Asistencia no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deleteAsistencia);

/**
 * @swagger
 * /api/asistencia-tutoria/tutoria/{tutoriaId}:
 *   get:
 *     summary: Obtener asistencias por tutoría
 *     tags: [Asistencias]
 *     parameters:
 *       - in: path
 *         name: tutoriaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tutoría
 *     responses:
 *       200:
 *         description: Lista de asistencias de la tutoría
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AsistenciaTutoria'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/tutoria/:tutoriaId', getAsistenciasByTutoria);

/**
 * @swagger
 * /api/asistencia-tutoria/estudiante/{estudianteId}:
 *   get:
 *     summary: Obtener asistencias por estudiante
 *     tags: [Asistencias]
 *     parameters:
 *       - in: path
 *         name: estudianteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del estudiante
 *     responses:
 *       200:
 *         description: Lista de asistencias del estudiante
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AsistenciaTutoria'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/estudiante/:estudianteId', getAsistenciasByEstudiante);

export default router; 