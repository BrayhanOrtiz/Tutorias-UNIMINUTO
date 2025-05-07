import express from 'express';
import { body } from 'express-validator';
import {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,    // ← importar
  actualizarUsuario,
  eliminarUsuario
} from '../controllers/usuariosController.js';

const router = express.Router();

// Listar todos
router.get('/', obtenerUsuarios);

// Obtener uno por ID
router.get('/:id', obtenerUsuarioPorId);

// Crear
router.post(
  '/',
  [
    body('id').isInt(),
    body('nombre').isString(),
    body('apellido').isString(),
    body('correo_institucional').isEmail(),
    body('contraseña').isLength({ min: 6 }),
    body('carrera_id').isInt(),
    body('fecha_nacimiento').isISO8601()
  ],
  crearUsuario
);

// Actualizar
router.put(
  '/:id',
  [
    body('nombre').optional().isString(),
    body('apellido').optional().isString(),
    body('correo_institucional').optional().isEmail(),
    body('contraseña').optional().isLength({ min: 6 }),
    body('carrera_id').optional().isInt(),
    body('fecha_nacimiento').optional().isISO8601(),
    body('rol_id').optional().isInt()
  ],
  actualizarUsuario
);

// Eliminar
router.delete('/:id', eliminarUsuario);

export default router;
