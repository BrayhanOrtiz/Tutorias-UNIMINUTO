import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import loginRoutes from './routes/loginRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import carreraRoutes from './routes/carreraRoutes.js';
import materiaRoutes from './routes/materiaRoutes.js';
import tutorRoutes from './routes/tutorRoutes.js';
import estudianteRoutes from './routes/estudianteRoutes.js';
import tutoriaRoutes from './routes/tutoriaRoutes.js';
import reporteRoutes from './routes/reporteRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api/login', loginRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/carreras', carreraRoutes);
app.use('/api/materias', materiaRoutes);
app.use('/api/tutores', tutorRoutes);
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/tutorias', tutoriaRoutes);
app.use('/api/reportes', reporteRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API de Tutorias UNIMINUTO funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`URL del servidor: http://localhost:${PORT}`);
});

// Manejo de errores del servidor
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`El puerto ${PORT} ya está en uso. Por favor, cierra la aplicación que lo está usando o usa otro puerto.`);
    } else {
        console.error('Error al iniciar el servidor:', error);
    }
    process.exit(1);
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
    console.log('Recibida señal SIGTERM. Cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('Recibida señal SIGINT. Cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado.');
        process.exit(0);
    });
});