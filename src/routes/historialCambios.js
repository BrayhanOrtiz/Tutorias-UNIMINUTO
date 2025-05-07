import express from 'express';
import {
    obtenerHistoriales,
    obtenerHistorialPorId,
    obtenerHistorialPorUsuario,
    eliminarHistorial
} from '../controllers/historialController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Historial de Cambios
 *   description: Endpoints para gestionar el historial de cambios
 */

/**
 * @swagger
 * /api/historial/usuario/{usuario_id}:
 *   get:
 *     summary: Obtiene el historial de cambios de un usuario
 *     tags: [Historial de Cambios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Historial de cambios del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/usuario/:usuario_id', obtenerHistorialPorUsuario);

/**
 * @swagger
 * /api/historial/usuario/{usuario_id}:
 *   get:
 *     summary: Obtiene un historial de cambios por su ID
 *     tags: [Historial de Cambios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Historial de cambios encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Historial no encontrado
 */
router.get('/usuario/:usuario_id', obtenerHistorialPorId);

/**
 * @swagger
 * /api/historial:
 *   get:
 *     summary: Obtiene todos los historiales de cambios
 *     tags: [Historial de Cambios]
 *     responses:
 *       200:
 *         description: Lista de todos los historiales de cambios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', obtenerHistoriales);

/**
 * @swagger
 * /api/historial/{id}:
 *   get:
 *     summary: Obtiene un historial de cambios por su ID
 *     tags: [Historial de Cambios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del historial
 *     responses:
 *       200:
 *         description: Historial de cambios encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Historial no encontrado
 */
router.get('/:id', obtenerHistorialPorId);

/**
 * @swagger
 * /api/historial/historial:
 *   post:
 *     summary: Crea un nuevo historial de cambios
 *     tags: [Historial de Cambios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Historial de cambios creado correctamente
 */
router.post('/historial', obtenerHistoriales);  // Cambia la lógica si era necesario

/**
 * @swagger
 * /api/historial/{id}:
 *   delete:
 *     summary: Elimina un historial de cambios por su ID
 *     tags: [Historial de Cambios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del historial
 *     responses:
 *       200:
 *         description: Historial de cambios eliminado correctamente
 *       404:
 *         description: Historial no encontrado
 */
router.delete('/:id', eliminarHistorial);

export default router;
