import express from 'express';
import { obtenerTemas } from '../controllers/temasController.js';

const router = express.Router();

router.get('/', obtenerTemas);

export default router;