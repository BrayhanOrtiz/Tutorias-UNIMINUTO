import express from 'express';
import usuariosRouter from './src/routes/usuarios.js';
import rolesRouter from './src/routes/roles.js';
import carrerasRouter from './src/routes/carreras.js';
import horariosRouter from './src/routes/horarios.js';
import historialRouter from './src/routes/historialCambios.js';


const app = express();

app.use(express.json());
app.use('/api/usuarios', usuariosRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/carreras', carrerasRouter);
app.use('/api/horarios', horariosRouter);
app.use('/api/historial', historialRouter);

export default app;



