import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert
} from '@mui/material';
import api from '../../services/api';

const ReportesTutorias = () => {
    const [docentes, setDocentes] = useState([]);
    const [docenteSeleccionado, setDocenteSeleccionado] = useState('');
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Cargar lista de docentes
    useEffect(() => {
        const cargarDocentes = async () => {
            try {
                setLoading(true);
                console.log('Iniciando petición a /usuarios/docentes...');
                const response = await api.get('/usuarios/docentes');
                console.log('Respuesta recibida:', response);
                
                if (response.data.success) {
                    setDocentes(response.data.data);
                    setError('');
                } else {
                    setError(response.data.message || 'No se pudieron cargar los docentes');
                }
            } catch (error) {
                console.error('Error detallado al cargar docentes:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                
                const errorMessage = error.response?.data?.error?.message 
                    || error.response?.data?.message 
                    || error.message 
                    || 'Error al cargar la lista de docentes';
                    
                setError(`${errorMessage}. Por favor, intente nuevamente.`);
            } finally {
                setLoading(false);
            }
        };
        cargarDocentes();
    }, []);

    // Cargar reportes cuando se selecciona un docente
    useEffect(() => {
        const cargarReportes = async () => {
            if (!docenteSeleccionado) return;
            
            setLoading(true);
            try {
                const response = await api.get(`/tutorias/reportes/${docenteSeleccionado}`);
                if (response.data.success) {
                    setReportes(response.data.data);
                    setError('');
                } else {
                    setError('No se pudieron cargar los reportes');
                }
            } catch (error) {
                console.error('Error al cargar reportes:', error);
                setError('Error al cargar los reportes del docente. Por favor, intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        cargarReportes();
    }, [docenteSeleccionado]);

    const handleDocenteChange = (event) => {
        setDocenteSeleccionado(event.target.value);
    };

    // Calcular estadísticas
    const calcularEstadisticas = () => {
        if (!reportes.length) return null;

        const totalTutorias = reportes.length;
        const tutoriasAsistidas = reportes.filter(r => r.asistio).length;
        const porcentajeAsistencia = (tutoriasAsistidas / totalTutorias) * 100;

        return {
            totalTutorias,
            tutoriasAsistidas,
            porcentajeAsistencia
        };
    };

    const estadisticas = calcularEstadisticas();

  return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Reportes de Tutorías
            </Typography>

            {/* Selector de Docente */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <FormControl fullWidth>
                        <InputLabel>Seleccionar Docente</InputLabel>
                        <Select
                            value={docenteSeleccionado}
                            onChange={handleDocenteChange}
                            label="Seleccionar Docente"
                        >
                            {docentes.map((docente) => (
                                <MenuItem key={docente.id} value={docente.id}>
                                    {docente.nombre} {docente.apellido}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : docenteSeleccionado && estadisticas ? (
                <>
                    {/* Estadísticas Generales */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total de Tutorías
                                    </Typography>
                                    <Typography variant="h4">
                                        {estadisticas.totalTutorias}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Tutorías Asistidas
                                    </Typography>
                                    <Typography variant="h4">
                                        {estadisticas.tutoriasAsistidas}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Porcentaje de Asistencia
                                    </Typography>
                                    <Typography variant="h4">
                                        {estadisticas.porcentajeAsistencia.toFixed(1)}%
      </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Tabla de Reportes */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell>Estudiante</TableCell>
                                    <TableCell>Tema</TableCell>
                                    <TableCell>Asistencia</TableCell>
                                    <TableCell>Observaciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportes.map((reporte) => (
                                    <TableRow key={reporte.id}>
                                        <TableCell>
                                            {new Date(reporte.fecha).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {reporte.estudiante_nombre} {reporte.estudiante_apellido}
                                        </TableCell>
                                        <TableCell>{reporte.tema}</TableCell>
                                        <TableCell>
                                            {reporte.asistio ? 'Asistió' : 'No Asistió'}
                                        </TableCell>
                                        <TableCell>{reporte.observaciones}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            ) : docenteSeleccionado ? (
                <Alert severity="info">
                    No hay reportes disponibles para este docente
                </Alert>
            ) : null}
    </Box>
  );
};

export default ReportesTutorias; 