import React, { useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Typography,
    TextField,
    Grid,
    Alert
} from '@mui/material';
import axios from 'axios';

const ReportesDocente = () => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [error, setError] = useState('');
    const docenteId = localStorage.getItem('userId');

    const handleGenerarReporte = async () => {
        if (!fechaInicio || !fechaFin) {
            setError('Por favor seleccione ambas fechas');
            return;
        }

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/reportes/tutorias-docente`,
                {
                    params: {
                        docente_id: docenteId,
                        fecha_inicio: fechaInicio,
                        fecha_fin: fechaFin
                    },
                    responseType: 'blob'
                }
            );

            // Crear un enlace para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_tutorias_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            setError('');
        } catch (error) {
            console.error('Error al generar reporte:', error);
            setError('Error al generar el reporte. Por favor, intente nuevamente.');
        }
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Reportes de Tutorías
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Fecha Inicio"
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Fecha Fin"
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mt: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGenerarReporte}
                        disabled={!fechaInicio || !fechaFin}
                    >
                        Generar Reporte Excel
                    </Button>
                </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Información del Reporte
                </Typography>
                <Typography variant="body1" paragraph>
                    El reporte incluirá la siguiente información:
                </Typography>
                <ul>
                    <li>Lista de estudiantes que han asistido a las tutorías</li>
                    <li>Fecha y hora de cada tutoría</li>
                    <li>Temas tratados</li>
                    <li>Observaciones registradas</li>
                    <li>Estado de las tutorías (completadas/pendientes)</li>
                </ul>
            </Paper>
        </Box>
    );
};

export default ReportesDocente; 