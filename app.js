import express from 'express';
import usuariosRouter from './src/routes/usuarios.js';
import rolesRouter from './src/routes/roles.js';
import carrerasRouter from './src/routes/carreras.js';
import horariosRouter from './src/routes/horarios.js';
import historialRouter from './src/routes/historialCambios.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const app = express();
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API de Tutorías',
        version: '1.0.0',
        description: 'API para gestionar tutorías',
      },
    },
    apis: ['./src/routes/*.js'], // Ruta a tus archivos de rutas para generar la documentación
  };
  
  const swaggerDocs = swaggerJSDoc(swaggerOptions);
  
  // Usar Swagger UI para mostrar la documentación en /api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use('/api/usuarios', usuariosRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/carreras', carrerasRouter);
app.use('/api/horarios', horariosRouter);
app.use('/api/historial', historialRouter);

export default app;



