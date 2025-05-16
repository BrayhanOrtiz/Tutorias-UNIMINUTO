import app from './app.js';

const PORT = process.env.PORT || 3000;

// Agregar middleware para logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
    console.log(`📚 Documentación API: http://localhost:${PORT}/api-docs`);
    console.log('=================================');
});
