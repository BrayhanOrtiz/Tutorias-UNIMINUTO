import express from 'express';
import {
    generarReporteAsistencias,
    generarReporteTutoriasDocente
} from '../controllers/reportesController.js';

const router = express.Router();

/**
 * @swagger
 * /api/reportes/asistencias:
 *   get:
 *     summary: Generar reporte de asistencias en Excel
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del reporte
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del reporte
 *       - in: query
 *         name: docente_id
 *         schema:
 *           type: integer
 *         description: ID del docente para filtrar
 *       - in: query
 *         name: estudiante_id
 *         schema:
 *           type: integer
 *         description: ID del estudiante para filtrar
 *       - in: query
 *         name: tema_id
 *         schema:
 *           type: integer
 *         description: ID del tema para filtrar
 *     responses:
 *       200:
 *         description: Archivo Excel con el reporte de asistencias
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/asistencias', generarReporteAsistencias);

/**
 * @swagger
 * /api/reportes/tutorias-docente:
 *   get:
 *     summary: Generar reporte de tutorías por docente en Excel
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: docente_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del docente
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del reporte
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del reporte
 *     responses:
 *       200:
 *         description: Archivo Excel con el reporte de tutorías del docente
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/tutorias-docente', generarReporteTutoriasDocente);

export default router; 