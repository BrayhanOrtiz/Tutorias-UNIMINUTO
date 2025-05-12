import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Importar rutas
import tutoriaRoutes from './src/routes/tutoria.js';
import asistenciaTutoriaRoutes from './src/routes/asistenciaTutoria.js';
import encuestaSatisfaccionRoutes from './src/routes/encuestaSatisfaccion.js';
import preguntaEncuestaRoutes from './src/routes/preguntaEncuesta.js';
import respuestaEncuestaRoutes from './src/routes/respuestaEncuesta.js';
import tareaTutoriaRoutes from './src/routes/tareaTutoria.js';
import historialCambiosRoutes from './src/routes/historialCambios.js';
import horariosRoutes from './src/routes/horarios.js';
import rolesRoutes from './src/routes/roles.js';
import carrerasRoutes from './src/routes/carreras.js';
import usuariosRoutes from './src/routes/usuarios.js';
import reportesRoutes from './src/routes/reportes.js';
import loginRoutes from './src/routes/login.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Tutorías UNIMINUTO',
            version: '1.0.0',
            description: 'API para el sistema de tutorías de UNIMINUTO',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desarrollo',
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Ruta a los archivos de rutas
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
app.use('/api/login', loginRoutes);
app.use('/api/tutorias', tutoriaRoutes);
app.use('/api/asistencia-tutoria', asistenciaTutoriaRoutes);
app.use('/api/encuesta-satisfaccion', encuestaSatisfaccionRoutes);
app.use('/api/pregunta-encuesta', preguntaEncuestaRoutes);
app.use('/api/respuesta-encuesta', respuestaEncuestaRoutes);
app.use('/api/tarea-tutoria', tareaTutoriaRoutes);
app.use('/api/historial-cambios', historialCambiosRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/carreras', carrerasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/reportes', reportesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API de Tutorías UNIMINUTO funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

export default app; 