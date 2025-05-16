import express from 'express';
import {
    getPreguntas,
    getPreguntaById,
    createPregunta,
    updatePregunta,
    deletePregunta
} from '../controllers/preguntaEncuestaController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     PreguntaEncuesta:
 *       type: object
 *       required:
 *         - texto_pregunta
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la pregunta
 *         texto_pregunta:
 *           type: string
 *           description: Texto de la pregunta
 */

/**
 * @swagger
 * /api/pregunta-encuesta:
 *   get:
 *     summary: Obtener todas las preguntas
 *     tags: [Preguntas]
 *     responses:
 *       200:
 *         description: Lista de preguntas
 */
router.get('/', getPreguntas);

/**
 * @swagger
 * /api/pregunta-encuesta/{id}:
 *   get:
 *     summary: Obtener una pregunta por ID
 *     tags: [Preguntas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pregunta encontrada
 *       404:
 *         description: Pregunta no encontrada
 */
router.get('/:id', getPreguntaById);

/**
 * @swagger
 * /api/pregunta-encuesta:
 *   post:
 *     summary: Crear una nueva pregunta
 *     tags: [Preguntas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - texto_pregunta
 *             properties:
 *               texto_pregunta:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pregunta creada
 *       400:
 *         description: Datos inválidos
 */
router.post('/', createPregunta);

/**
 * @swagger
 * /api/pregunta-encuesta/{id}:
 *   put:
 *     summary: Actualizar una pregunta
 *     tags: [Preguntas]
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
 *             required:
 *               - texto_pregunta
 *             properties:
 *               texto_pregunta:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pregunta actualizada
 *       404:
 *         description: Pregunta no encontrada
 */
router.put('/:id', updatePregunta);

/**
 * @swagger
 * /api/pregunta-encuesta/{id}:
 *   delete:
 *     summary: Eliminar una pregunta
 *     tags: [Preguntas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pregunta eliminada
 *       404:
 *         description: Pregunta no encontrada
 */
router.delete('/:id', deletePregunta);

export default router; 