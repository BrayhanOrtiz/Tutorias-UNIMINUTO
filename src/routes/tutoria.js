import express from 'express';
import {
    getTutorias,
    getTutoriaById,
    createTutoria,
    updateTutoria,
    deleteTutoria,
    getTutoriasByEstudiante,
    getTutoriasByDocente,
    getTutoriasByTema
} from '../controllers/tutoriasController.js';

const router = express.Router();

/**
 * @swagger
 * /api/tutorias:
 *   get:
 *     summary: Obtener todas las tutorías
 *     tags: [Tutorías]
 *     responses:
 *       200:
 *         description: Lista de tutorías
 */
router.get('/', getTutorias);

/**
 * @swagger
 * /api/tutorias/{id}:
 *   get:
 *     summary: Obtener una tutoría por ID
 *     tags: [Tutorías]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tutoría encontrada
 *       404:
 *         description: Tutoría no encontrada
 */
router.get('/:id', getTutoriaById);

/**
 * @swagger
 * /api/tutorias:
 *   post:
 *     summary: Crear una nueva tutoría
 *     tags: [Tutorías]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estudiante_id
 *               - docente_id
 *               - tema_id
 *               - fecha_hora_agendada
 *             properties:
 *               estudiante_id:
 *                 type: integer
 *               docente_id:
 *                 type: integer
 *               tema_id:
 *                 type: integer
 *               fecha_hora_agendada:
 *                 type: string
 *                 format: date-time
 *               estado:
 *                 type: string
 *                 enum: [pendiente, confirmada, cancelada, completada]
 *     responses:
 *       201:
 *         description: Tutoría creada
 *       400:
 *         description: Datos inválidos
 */
router.post('/', createTutoria);

/**
 * @swagger
 * /api/tutorias/{id}:
 *   put:
 *     summary: Actualizar una tutoría
 *     tags: [Tutorías]
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
 *               estudiante_id:
 *                 type: integer
 *               docente_id:
 *                 type: integer
 *               tema_id:
 *                 type: integer
 *               fecha_hora_agendada:
 *                 type: string
 *                 format: date-time
 *               estado:
 *                 type: string
 *                 enum: [pendiente, confirmada, cancelada, completada]
 *     responses:
 *       200:
 *         description: Tutoría actualizada
 *       404:
 *         description: Tutoría no encontrada
 */
router.put('/:id', updateTutoria);

/**
 * @swagger
 * /api/tutorias/{id}:
 *   delete:
 *     summary: Eliminar una tutoría
 *     tags: [Tutorías]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tutoría eliminada
 *       404:
 *         description: Tutoría no encontrada
 */
router.delete('/:id', deleteTutoria);

/**
 * @swagger
 * /api/tutorias/estudiante/{estudianteId}:
 *   get:
 *     summary: Obtener tutorías por estudiante
 *     tags: [Tutorías]
 *     parameters:
 *       - in: path
 *         name: estudianteId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de tutorías del estudiante
 */
router.get('/estudiante/:estudianteId', getTutoriasByEstudiante);

/**
 * @swagger
 * /api/tutorias/docente/{docenteId}:
 *   get:
 *     summary: Obtener tutorías por docente
 *     tags: [Tutorías]
 *     parameters:
 *       - in: path
 *         name: docenteId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de tutorías del docente
 */
router.get('/docente/:docenteId', getTutoriasByDocente);

/**
 * @swagger
 * /api/tutorias/tema/{temaId}:
 *   get:
 *     summary: Obtener tutorías por tema
 *     tags: [Tutorías]
 *     parameters:
 *       - in: path
 *         name: temaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de tutorías del tema
 */
router.get('/tema/:temaId', getTutoriasByTema);

export default router; 