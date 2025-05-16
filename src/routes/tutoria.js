import express from 'express';
import {
    getTutorias,
    getTutoriaById,
    createTutoria,
    updateTutoria,
    deleteTutoria,
    getTutoriasByEstudiante,
    getTutoriasByDocente,
    getTutoriasByTema,
    habilitarFirmaTutoria
} from '../controllers/tutoriasController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Tutoria:
 *       type: object
 *       required:
 *         - estudiante_id
 *         - docente_id
 *         - tema_id
 *         - fecha_hora_agendada
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la tutoría
 *         estudiante_id:
 *           type: integer
 *           description: ID del estudiante
 *         docente_id:
 *           type: integer
 *           description: ID del docente
 *         tema_id:
 *           type: integer
 *           description: ID del tema
 *         fecha_hora_agendada:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora programada de la tutoría
 *         hora_inicio_real:
 *           type: string
 *           format: date-time
 *           description: Hora real de inicio de la tutoría
 *         hora_fin_real:
 *           type: string
 *           format: date-time
 *           description: Hora real de finalización de la tutoría
 *         firma_docente_habilitada:
 *           type: boolean
 *           description: Indica si el docente ha habilitado la firma
 *         firmada_estudiante:
 *           type: boolean
 *           description: Indica si el estudiante ha firmado
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
 *   name: Tutorías
 *   description: API para la gestión de tutorías
 */

/**
 * @swagger
 * /api/tutorias:
 *   get:
 *     summary: Obtener todas las tutorías
 *     tags: [Tutorías]
 *     responses:
 *       200:
 *         description: Lista de tutorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tutoria'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *         description: ID de la tutoría
 *     responses:
 *       200:
 *         description: Tutoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tutoria'
 *       404:
 *         description: Tutoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *             $ref: '#/components/schemas/Tutoria'
 *     responses:
 *       201:
 *         description: Tutoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tutoria'
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
 *         description: ID de la tutoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tutoria'
 *     responses:
 *       200:
 *         description: Tutoría actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tutoria'
 *       404:
 *         description: Tutoría no encontrada
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
 *         description: ID de la tutoría
 *     responses:
 *       200:
 *         description: Tutoría eliminada exitosamente
 *       404:
 *         description: Tutoría no encontrada
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
 *         description: ID del estudiante
 *     responses:
 *       200:
 *         description: Lista de tutorías del estudiante
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tutoria'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *         description: ID del docente
 *     responses:
 *       200:
 *         description: Lista de tutorías del docente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tutoria'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *         description: ID del tema
 *     responses:
 *       200:
 *         description: Lista de tutorías del tema
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tutoria'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/tema/:temaId', getTutoriasByTema);

/**
 * @swagger
 * /api/tutorias/{id}/habilitar-firma:
 *   post:
 *     summary: Habilitar la firma de una tutoría
 *     tags: [Tutorías]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tutoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - docente_id
 *             properties:
 *               docente_id:
 *                 type: integer
 *                 description: ID del docente que habilita la firma
 *     responses:
 *       200:
 *         description: Firma habilitada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tutoria'
 *       400:
 *         description: No se puede habilitar la firma
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: No tiene permiso para habilitar la firma
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tutoría no encontrada
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
router.post('/:id/habilitar-firma', habilitarFirmaTutoria);

export default router; 