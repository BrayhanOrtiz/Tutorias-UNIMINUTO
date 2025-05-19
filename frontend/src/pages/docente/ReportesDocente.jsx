import React, { useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Typography,
    Grid,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ReportesDocente = () => {
    const [mes, setMes] = useState('');
    const [anio, setAnio] = useState(new Date().getFullYear());
    const [error, setError] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const { user } = useAuth();
    const docenteId = user?.id;

    const meses = [
        { value: 1, label: 'Enero' },
        { value: 2, label: 'Febrero' },
        { value: 3, label: 'Marzo' },
        { value: 4, label: 'Abril' },
        { value: 5, label: 'Mayo' },
        { value: 6, label: 'Junio' },
        { value: 7, label: 'Julio' },
        { value: 8, label: 'Agosto' },
        { value: 9, label: 'Septiembre' },
        { value: 10, label: 'Octubre' },
        { value: 11, label: 'Noviembre' },
        { value: 12, label: 'Diciembre' }
    ];

    const anios = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleGenerarReporte = async () => {
        if (!mes) {
            setError('Por favor seleccione un mes');
            return;
        }

        if (!docenteId) {
            setError('No se pudo obtener el ID del docente');
            showSnackbar('Error: No se pudo obtener el ID del docente', 'error');
            return;
        }

        try {
            // Calcular fecha inicio y fin del mes seleccionado
            const fechaInicio = new Date(anio, mes - 1, 1).toISOString().split('T')[0];
            const fechaFin = new Date(anio, mes, 0).toISOString().split('T')[0];

            console.log('Enviando parámetros:', {
                docente_id: docenteId,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin
            });

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/reportes/tutorias-docente`,
                {
                    params: {
                        docente_id: docenteId,
                        fecha_inicio: fechaInicio,
                        fecha_fin: fechaFin
                    },
                    responseType: 'blob',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            // Crear un enlace para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_tutorias_${mes}_${anio}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            setError('');
            showSnackbar('Reporte generado exitosamente');
        } catch (error) {
            console.error('Error al generar reporte:', error);
            const errorMessage = error.response?.data?.error || 'Error al generar el reporte. Por favor, intente nuevamente.';
            setError(errorMessage);
            showSnackbar(errorMessage, 'error');
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
                        <FormControl fullWidth>
                            <InputLabel>Mes</InputLabel>
                            <Select
                                value={mes}
                                label="Mes"
                                onChange={(e) => setMes(e.target.value)}
                            >
                                {meses.map((mes) => (
                                    <MenuItem key={mes.value} value={mes.value}>
                                        {mes.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Año</InputLabel>
                            <Select
                                value={anio}
                                label="Año"
                                onChange={(e) => setAnio(e.target.value)}
                            >
                                {anios.map((anio) => (
                                    <MenuItem key={anio} value={anio}>
                                        {anio}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                        disabled={!mes}
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
                    El reporte incluirá la siguiente información para el mes seleccionado:
                </Typography>
                <ul>
                    <li>Lista de estudiantes que han asistido a las tutorías</li>
                    <li>Fecha y hora de cada tutoría</li>
                    <li>Temas tratados</li>
                    <li>Observaciones registradas</li>
                    <li>Estado de las tutorías (completadas/pendientes)</li>
                </ul>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ReportesDocente; 