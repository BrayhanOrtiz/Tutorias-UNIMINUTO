import express from 'express';
import {
    getRespuestas,
    getRespuestaById,
    createRespuesta,
    updateRespuesta,
    deleteRespuesta,
    getRespuestasByEncuesta,
    getRespuestasByPregunta,
    createRespuestasBatch
} from '../controllers/respuestaEncuestaController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RespuestaEncuesta:
 *       type: object
 *       required:
 *         - encuesta_id
 *         - pregunta_id
 *         - valor_respuesta
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la respuesta
 *         encuesta_id:
 *           type: integer
 *           description: ID de la encuesta
 *         pregunta_id:
 *           type: integer
 *           description: ID de la pregunta
 *         valor_respuesta:
 *           type: string
 *           description: Valor de la respuesta
 *         fecha_respuesta:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la respuesta
 */

/**
 * @swagger
 * /api/respuesta-encuesta:
 *   get:
 *     summary: Obtener todas las respuestas
 *     tags: [Respuestas]
 *     responses:
 *       200:
 *         description: Lista de respuestas
 */
router.get('/', getRespuestas);

/**
 * @swagger
 * /api/respuesta-encuesta/{id}:
 *   get:
 *     summary: Obtener una respuesta por ID
 *     tags: [Respuestas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Respuesta encontrada
 *       404:
 *         description: Respuesta no encontrada
 */
router.get('/:id', getRespuestaById);

/**
 * @swagger
 * /api/respuesta-encuesta:
 *   post:
 *     summary: Crear una nueva respuesta
 *     tags: [Respuestas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - encuesta_id
 *               - pregunta_id
 *               - valor_respuesta
 *             properties:
 *               encuesta_id:
 *                 type: integer
 *               pregunta_id:
 *                 type: integer
 *               valor_respuesta:
 *                 type: string
 *     responses:
 *       201:
 *         description: Respuesta creada
 *       400:
 *         description: Datos inválidos
 */
router.post('/', createRespuesta);

/**
 * @swagger
 * /api/respuesta-encuesta/{id}:
 *   put:
 *     summary: Actualizar una respuesta
 *     tags: [Respuestas]
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
 *               encuesta_id:
 *                 type: integer
 *               pregunta_id:
 *                 type: integer
 *               valor_respuesta:
 *                 type: string
 *     responses:
 *       200:
 *         description: Respuesta actualizada
 *       404:
 *         description: Respuesta no encontrada
 */
router.put('/:id', updateRespuesta);

/**
 * @swagger
 * /api/respuesta-encuesta/{id}:
 *   delete:
 *     summary: Eliminar una respuesta
 *     tags: [Respuestas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Respuesta eliminada
 *       404:
 *         description: Respuesta no encontrada
 */
router.delete('/:id', deleteRespuesta);

/**
 * @swagger
 * /api/respuesta-encuesta/encuesta/{encuestaId}:
 *   get:
 *     summary: Obtener respuestas por encuesta
 *     tags: [Respuestas]
 *     parameters:
 *       - in: path
 *         name: encuestaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de respuestas de la encuesta
 */
router.get('/encuesta/:encuestaId', getRespuestasByEncuesta);

/**
 * @swagger
 * /api/respuesta-encuesta/pregunta/{preguntaId}:
 *   get:
 *     summary: Obtener respuestas por pregunta
 *     tags: [Respuestas]
 *     parameters:
 *       - in: path
 *         name: preguntaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de respuestas de la pregunta
 */
router.get('/pregunta/:preguntaId', getRespuestasByPregunta);

/**
 * @swagger
 * /api/respuesta-encuesta/batch:
 *   post:
 *     summary: Crear múltiples respuestas
 *     tags: [Respuestas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - encuesta_satisfaccion_id
 *                 - pregunta_encuesta_id
 *                 - respuesta
 *               properties:
 *                 encuesta_satisfaccion_id:
 *                   type: integer
 *                 pregunta_encuesta_id:
 *                   type: integer
 *                 respuesta:
 *                   type: string
 *     responses:
 *       201:
 *         description: Respuestas creadas
 *       400:
 *         description: Datos inválidos
 */
router.post('/batch', createRespuestasBatch);

export default router; 