import express from 'express';
import {
  crearRol,
  obtenerRoles,
  obtenerRolPorId,
  actualizarRol,
  eliminarRol
} from '../controllers/rolesController.js';

const router = express.Router();

// Listar todos los roles
router.get('/', obtenerRoles);

// Obtener un rol por ID
router.get('/:id', obtenerRolPorId);

// Crear un nuevo rol
router.post('/', crearRol);

// Actualizar un rol
router.put('/:id', actualizarRol);

// Eliminar un rol
router.delete('/:id', eliminarRol);

export default router;
