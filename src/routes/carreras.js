import express from 'express';
import {
  obtenerCarreras,
  obtenerCarreraPorId,
  crearCarrera,
  actualizarCarrera,
  eliminarCarrera
} from '../controllers/carrerasController.js';

const router = express.Router();

router.get('/', obtenerCarreras);
router.get('/:id', obtenerCarreraPorId);
router.post('/', crearCarrera);
router.put('/:id', actualizarCarrera);
router.delete('/:id', eliminarCarrera);

export default router;
