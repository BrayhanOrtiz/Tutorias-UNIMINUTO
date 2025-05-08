import express from 'express';
import {
    getEncuestas,
    getEncuestaById,
    createEncuesta,
    updateEncuesta,
    deleteEncuesta,
    getEncuestasByTutoria,
    getRespuestasByEncuesta
} from '../controllers/encuestaSatisfaccionController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     EncuestaSatisfaccion:
 *       type: object
 *       required:
 *         - tutoria_id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la encuesta
 *         tutoria_id:
 *           type: integer
 *           description: ID de la tutoría
 *         fecha_respuesta:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la respuesta
 */

/**
 * @swagger
 * /api/encuesta-satisfaccion:
 *   get:
 *     summary: Obtener todas las encuestas
 *     tags: [Encuestas]
 *     responses:
 *       200:
 *         description: Lista de encuestas
 */
router.get('/', getEncuestas);

/**
 * @swagger
 * /api/encuesta-satisfaccion/{id}:
 *   get:
 *     summary: Obtener una encuesta por ID
 *     tags: [Encuestas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Encuesta encontrada
 *       404:
 *         description: Encuesta no encontrada
 */
router.get('/:id', getEncuestaById);

/**
 * @swagger
 * /api/encuesta-satisfaccion:
 *   post:
 *     summary: Crear una nueva encuesta
 *     tags: [Encuestas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tutoria_id
 *             properties:
 *               tutoria_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Encuesta creada
 *       400:
 *         description: Datos inválidos
 */
router.post('/', createEncuesta);

/**
 * @swagger
 * /api/encuesta-satisfaccion/{id}:
 *   put:
 *     summary: Actualizar una encuesta
 *     tags: [Encuestas]
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
 *     responses:
 *       200:
 *         description: Encuesta actualizada
 *       404:
 *         description: Encuesta no encontrada
 */
router.put('/:id', updateEncuesta);

/**
 * @swagger
 * /api/encuesta-satisfaccion/{id}:
 *   delete:
 *     summary: Eliminar una encuesta
 *     tags: [Encuestas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Encuesta eliminada
 *       404:
 *         description: Encuesta no encontrada
 */
router.delete('/:id', deleteEncuesta);

/**
 * @swagger
 * /api/encuesta-satisfaccion/tutoria/{tutoriaId}:
 *   get:
 *     summary: Obtener encuestas por tutoría
 *     tags: [Encuestas]
 *     parameters:
 *       - in: path
 *         name: tutoriaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de encuestas de la tutoría
 */
router.get('/tutoria/:tutoriaId', getEncuestasByTutoria);

/**
 * @swagger
 * /api/encuesta-satisfaccion/{id}/respuestas:
 *   get:
 *     summary: Obtener respuestas de una encuesta
 *     tags: [Encuestas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de respuestas de la encuesta
 */
router.get('/:id/respuestas', getRespuestasByEncuesta);

export default router; 