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
 *     responses:
 *       200:
 *         description: Asistencia encontrada
 *       404:
 *         description: Asistencia no encontrada
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
 *             type: object
 *             required:
 *               - tutoria_id
 *               - estudiante_id
 *             properties:
 *               tutoria_id:
 *                 type: integer
 *               estudiante_id:
 *                 type: integer
 *               observaciones:
 *                 type: string
 *     responses:
 *       201:
 *         description: Asistencia creada
 *       400:
 *         description: Datos inválidos
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tutoria_id:
 *                 type: integer
 *               estudiante_id:
 *                 type: integer
 *               observaciones:
 *                 type: string
 *     responses:
 *       200:
 *         description: Asistencia actualizada
 *       404:
 *         description: Asistencia no encontrada
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
 *     responses:
 *       200:
 *         description: Asistencia eliminada
 *       404:
 *         description: Asistencia no encontrada
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
 *     responses:
 *       200:
 *         description: Lista de asistencias de la tutoría
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
 *     responses:
 *       200:
 *         description: Lista de asistencias del estudiante
 */
router.get('/estudiante/:estudianteId', getAsistenciasByEstudiante);

export default router; 