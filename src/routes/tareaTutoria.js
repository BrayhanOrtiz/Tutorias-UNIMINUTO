import express from 'express';
import {
    getTareas,
    getTareaById,
    createTarea,
    updateTarea,
    deleteTarea,
    getTareasByTutoria,
    getTareasByAsignador,
    getTareasByEstado
} from '../controllers/tareaTutoriaController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     TareaTutoria:
 *       type: object
 *       required:
 *         - tutoria_id
 *         - descripcion
 *         - asignada_por
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la tarea
 *         tutoria_id:
 *           type: integer
 *           description: ID de la tutoría
 *         descripcion:
 *           type: string
 *           description: Descripción de la tarea
 *         estado:
 *           type: string
 *           enum: [pendiente, en_progreso, completada]
 *           description: Estado actual de la tarea
 *         asignada_por:
 *           type: integer
 *           description: ID del usuario que asignó la tarea
 *         fecha_creacion:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación de la tarea
 *         fecha_entrega:
 *           type: string
 *           format: date
 *           description: Fecha de entrega de la tarea
 */

/**
 * @swagger
 * /api/tarea-tutoria:
 *   get:
 *     summary: Obtiene todas las tareas de tutoría
 *     tags: [Tareas de Tutoría]
 *     responses:
 *       200:
 *         description: Lista de tareas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TareaTutoria'
 */
router.get('/', getTareas);

/**
 * @swagger
 * /api/tarea-tutoria/{id}:
 *   get:
 *     summary: Obtiene una tarea por ID
 *     tags: [Tareas de Tutoría]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles de la tarea
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TareaTutoria'
 */
router.get('/:id', getTareaById);

/**
 * @swagger
 * /api/tarea-tutoria:
 *   post:
 *     summary: Crea una nueva tarea
 *     tags: [Tareas de Tutoría]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TareaTutoria'
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 */
router.post('/', createTarea);

/**
 * @swagger
 * /api/tarea-tutoria/{id}:
 *   put:
 *     summary: Actualiza una tarea existente
 *     tags: [Tareas de Tutoría]
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
 *             $ref: '#/components/schemas/TareaTutoria'
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 */
router.put('/:id', updateTarea);

/**
 * @swagger
 * /api/tarea-tutoria/{id}:
 *   delete:
 *     summary: Elimina una tarea
 *     tags: [Tareas de Tutoría]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarea eliminada exitosamente
 */
router.delete('/:id', deleteTarea);

/**
 * @swagger
 * /api/tarea-tutoria/tutoria/{tutoriaId}:
 *   get:
 *     summary: Obtiene las tareas de una tutoría específica
 *     tags: [Tareas de Tutoría]
 *     parameters:
 *       - in: path
 *         name: tutoriaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de tareas de la tutoría
 */
router.get('/tutoria/:tutoriaId', getTareasByTutoria);

/**
 * @swagger
 * /api/tarea-tutoria/asignador/{asignadorId}:
 *   get:
 *     summary: Obtiene las tareas asignadas por un usuario específico
 *     tags: [Tareas de Tutoría]
 *     parameters:
 *       - in: path
 *         name: asignadorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de tareas asignadas por el usuario
 */
router.get('/asignador/:asignadorId', getTareasByAsignador);

/**
 * @swagger
 * /api/tarea-tutoria/estado/{estado}:
 *   get:
 *     summary: Obtiene las tareas por estado
 *     tags: [Tareas de Tutoría]
 *     parameters:
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pendiente, en_progreso, completada]
 *     responses:
 *       200:
 *         description: Lista de tareas por estado
 */
router.get('/estado/:estado', getTareasByEstado);

export default router; 