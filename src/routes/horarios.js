import express from 'express';
import {
  obtenerHorarios,
  obtenerHorarioPorId,
  crearHorario,
  actualizarHorario,
  actualizarHorarioEspecifico, 
  eliminarHorario,
  eliminarHorarioEspecifico,
  obtenerHorariosPorUsuario
} from '../controllers/horarioController.js';

const router = express.Router();
router.delete('/usuario/:usuario_id/:id', eliminarHorarioEspecifico);
router.put('/usuario/:usuario_id/:id', actualizarHorarioEspecifico);
router.get('/usuario/:usuario_id', obtenerHorariosPorUsuario);
router.get('/', obtenerHorarios);
router.get('/:id', obtenerHorarioPorId);
router.post('/', crearHorario);
router.put('/:id', actualizarHorario);
router.delete('/:id', eliminarHorario);

export default router;

