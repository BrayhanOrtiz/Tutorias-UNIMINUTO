import express from 'express';
import usuariosRouter from './src/routes/usuarios.js';
import rolesRouter from './src/routes/roles.js';

const app = express();

app.use(express.json());
app.use('/api/usuarios', usuariosRouter);
app.use('/api/roles', rolesRouter);

export default app;
