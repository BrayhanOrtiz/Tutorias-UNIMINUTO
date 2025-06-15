import express from 'express';
import { 
    getNotificaciones, 
    createNotificacion, 
    marcarComoLeida, 
    marcarTodasComoLeidas,
    getContadorNoLeidas,
    deleteNotificacion
} from '../controllers/notificacionesController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Obtener notificaciones de un usuario
router.get('/usuario/:usuarioId', getNotificaciones);

// Crear una nueva notificación
router.post('/', createNotificacion);

// Marcar una notificación como leída
router.put('/:id/leer', marcarComoLeida);

// Eliminar una notificación
router.delete('/:id', deleteNotificacion);

// Marcar todas las notificaciones como leídas
router.put('/usuario/:usuarioId/leer-todas', marcarTodasComoLeidas);

// Obtener contador de notificaciones no leídas
router.get('/usuario/:usuarioId/contador', getContadorNoLeidas);

export default router; 