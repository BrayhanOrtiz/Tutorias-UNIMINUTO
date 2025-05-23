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
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../components/NotificationSystem';

const ReportesDocente = () => {
    const [mes, setMes] = useState('');
    const [anio, setAnio] = useState(new Date().getFullYear());
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const docenteId = user?.id;
    const { showNotification } = useNotification();

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

    const handleGenerarReporte = async () => {
        if (!mes) {
            setError('Por favor seleccione un mes');
            showNotification('Por favor seleccione un mes', 'warning');
            return;
        }

        if (!docenteId) {
            setError('No se pudo obtener el ID del docente');
            showNotification('Error: No se pudo obtener el ID del docente', 'error');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            // Calcular fecha de inicio y fin del mes
            const fechaInicio = new Date(anio, mes - 1, 1).toISOString().split('T')[0];
            const fechaFin = new Date(anio, mes, 0).toISOString().split('T')[0];

            console.log('Enviando petición para generar reporte...', {
                docenteId,
                fechaInicio,
                fechaFin
            });

            const response = await axios.get('/api/reportes/tutorias-docente', {
                params: { 
                    docente_id: docenteId,
                    fecha_inicio: fechaInicio,
                    fecha_fin: fechaFin
                },
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Respuesta recibida:', {
                type: response.data.type,
                size: response.data.size,
                headers: response.headers
            });

            // Crear un enlace para descargar el archivo
            const blob = new Blob([response.data], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_tutorias_${mes}_${anio}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            showNotification('Reporte generado exitosamente', 'success');
        } catch (error) {
            console.error('Error al generar reporte:', error);
            console.error('Detalles del error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });

            if (error.message === 'No hay token de autenticación') {
                showNotification('Error de autenticación. Por favor, inicie sesión nuevamente.', 'error');
            } else if (error.response?.status === 404) {
                const mesSeleccionado = meses.find(m => m.value === parseInt(mes))?.label;
                showNotification(
                    `No hay tutorías registradas para ${mesSeleccionado} de ${anio}`,
                    'info'
                );
            } else {
                showNotification(
                    error.response?.data?.message || 
                    'Error al generar el reporte. Por favor, intente nuevamente.',
                    'error'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Generar Reporte de Tutorías
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={2}>
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

                <Box sx={{ mt: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGenerarReporte}
                        disabled={!mes || loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loading ? 'Generando...' : 'Generar Reporte Excel'}
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
        </Box>
    );
};

export default ReportesDocente; 