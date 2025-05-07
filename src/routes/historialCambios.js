import express from 'express';
import {
    obtenerHistoriales,
    obtenerHistorialPorId,
    obtenerHistorialPorUsuario,
    crearHistorial,
    eliminarHistorial
} from '../controllers/historialController.js';

const router = express.Router();
router.get('/usuario/:usuario_id', obtenerHistorialPorUsuario);
router.get('/usuario/:usuario_id', obtenerHistorialPorId);
router.get('/', obtenerHistoriales);
router.get('/:id', obtenerHistorialPorId);
router.post('/', crearHistorial);
router.delete('/:id', eliminarHistorial);

export default router;
