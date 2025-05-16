import express from 'express';
import {
  obtenerCarreras,
  obtenerCarreraPorId,
  crearCarrera,
  actualizarCarrera,
  eliminarCarrera
} from '../controllers/carrerasController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Carreras
 *   description: Endpoints para gestionar carreras
 */

/**
 * @swagger
 * /api/carreras:
 *   get:
 *     summary: Obtiene todas las carreras
 *     tags: [Carreras]
 *     responses:
 *       200:
 *         description: Lista de todas las carreras
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', obtenerCarreras);

/**
 * @swagger
 * /api/carreras/{id}:
 *   get:
 *     summary: Obtiene una carrera por su ID
 *     tags: [Carreras]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la carrera
 *     responses:
 *       200:
 *         description: Carrera encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Carrera no encontrada
 */
router.get('/:id', obtenerCarreraPorId);

/**
 * @swagger
 * /api/carreras:
 *   post:
 *     summary: Crea una nueva carrera
 *     tags: [Carreras]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               nombre_carrera:
 *                 type: string
 *     responses:
 *       201:
 *         description: Carrera creada correctamente
 */

router.post('/', crearCarrera);

/**
 * @swagger
 * /api/carreras/{id}:
 *   put:
 *     summary: Actualiza una carrera por su ID
 *     tags: [Carreras]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la carrera
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Carrera actualizada correctamente
 *       404:
 *         description: Carrera no encontrada
 */
router.put('/:id', actualizarCarrera);

/**
 * @swagger
 * /api/carreras/{id}:
 *   delete:
 *     summary: Elimina una carrera por su ID
 *     tags: [Carreras]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la carrera
 *     responses:
 *       200:
 *         description: Carrera eliminada correctamente
 *       404:
 *         description: Carrera no encontrada
 */
router.delete('/:id', eliminarCarrera);

export default router;
