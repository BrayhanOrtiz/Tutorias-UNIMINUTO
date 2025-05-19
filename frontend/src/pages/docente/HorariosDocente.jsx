import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Alert,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    Divider,
    Snackbar
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const HORAS_DIA = Array.from({ length: 12 }, (_, i) => `${i + 6}:00`); // De 6:00 a 17:00

const HorariosDocente = () => {
    const [horarios, setHorarios] = useState([]);
    const [open, setOpen] = useState(false);
    const [openExperticia, setOpenExperticia] = useState(false);
    const [editingHorario, setEditingHorario] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingExperticia, setLoadingExperticia] = useState(false);
    const [experticia, setExperticia] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [formData, setFormData] = useState({
        dia: '',
        hora_inicio: '',
        hora_fin: '',
        salon: ''
    });

    const { user } = useAuth();
    const docenteId = user?.id;

    console.log('Usuario actual:', user);
    console.log('ID del docente:', docenteId);

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

    useEffect(() => {
        console.log('useEffect ejecutado, docenteId:', docenteId);
        if (docenteId) {
            cargarHorarios();
            cargarExperticia();
        } else {
            console.error('No hay ID de docente disponible en el useEffect');
        }
    }, [docenteId]);

    const cargarHorarios = async () => {
        try {
            if (!docenteId) {
                console.error('No hay ID de docente disponible en cargarHorarios');
                showSnackbar('Error: No hay ID de docente disponible', 'error');
                return;
            }

            console.log('Intentando cargar horarios para docente:', docenteId);
            console.log('Token de autenticación:', localStorage.getItem('token'));
            
            const response = await api.get(`/horarios/usuario/${docenteId}`);
            console.log('Respuesta del servidor:', response.data);
            
            if (response.data.success) {
                setHorarios(response.data.data || []);
                console.log('Horarios cargados:', response.data.data);
            } else {
                console.error('Error en la respuesta del servidor:', response.data);
                showSnackbar(response.data.error || 'Error al cargar los horarios', 'error');
            }
        } catch (error) {
            console.error('Error al cargar horarios:', error);
            console.error('Detalles del error:', error.response?.data);
            console.error('Estado del error:', error.response?.status);
            console.error('Headers de la respuesta:', error.response?.headers);
            showSnackbar(error.response?.data?.error || 'Error al cargar los horarios', 'error');
        }
    };

    const cargarExperticia = async () => {
        try {
            setLoadingExperticia(true);
            const response = await api.get(`/usuarios/${docenteId}`);
            console.log('Datos del usuario:', response.data);
            if (response.data.success) {
                setExperticia(response.data.data.experticia || '');
            }
        } catch (error) {
            console.error('Error al cargar experticia:', error);
            showSnackbar('Error al cargar la experticia', 'error');
        } finally {
            setLoadingExperticia(false);
        }
    };

    const handleOpen = (horario = null) => {
        if (horario) {
            setEditingHorario(horario);
            setFormData({
                dia: horario.dia_semana,
                hora_inicio: horario.hora_inicio,
                hora_fin: horario.hora_fin,
                salon: horario.salon
            });
        } else {
            setEditingHorario(null);
            setFormData({
                dia: '',
                hora_inicio: '',
                hora_fin: '',
                salon: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingHorario(null);
        setFormData({
            dia: '',
            hora_inicio: '',
            hora_fin: '',
            salon: ''
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validar que todos los campos estén llenos
            if (!formData.dia || !formData.hora_inicio || !formData.hora_fin || !formData.salon) {
                setError('Todos los campos son requeridos');
                return;
            }

            // Validar que la hora de inicio sea menor que la hora de fin
            if (formData.hora_inicio >= formData.hora_fin) {
                setError('La hora de inicio debe ser menor que la hora de fin');
                return;
            }

            // Asegurar que las horas tengan el formato correcto (HH:MM:SS)
            const horaInicio = formData.hora_inicio.includes(':') ? formData.hora_inicio : `${formData.hora_inicio}:00`;
            const horaFin = formData.hora_fin.includes(':') ? formData.hora_fin : `${formData.hora_fin}:00`;

            const horarioData = {
                dia_semana: formData.dia,
                hora_inicio: horaInicio,
                hora_fin: horaFin,
                salon: formData.salon
            };

            console.log('Enviando datos del horario:', horarioData);

            let response;
            if (editingHorario) {
                response = await api.put(
                    `/horarios/${editingHorario.id}`,
                    horarioData
                );
            } else {
                response = await api.post('/horarios', {
                    ...horarioData,
                    usuario_id: docenteId
                });
            }
            
            console.log('Respuesta del servidor:', response.data);
            
            if (response.data.success) {
                handleClose();
                await cargarHorarios(); // Esperar a que se recarguen los horarios
                showSnackbar(response.data.message || 'Horario guardado exitosamente');
            } else {
                setError(response.data.message || 'Error al guardar el horario');
                showSnackbar(response.data.message || 'Error al guardar el horario', 'error');
            }
        } catch (error) {
            console.error('Error al guardar horario:', error);
            const errorMessage = error.response?.data?.message || 'Error al guardar el horario. Por favor, intente nuevamente.';
            setError(errorMessage);
            showSnackbar(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            if (!window.confirm('¿Está seguro de eliminar este horario?')) {
                return;
            }

            setLoading(true);
            const response = await api.delete(`/horarios/${id}`);
            
            if (response.data.success) {
                await cargarHorarios(); // Esperar a que se recarguen los horarios
                showSnackbar('Horario eliminado exitosamente');
            } else {
                showSnackbar(response.data.message || 'Error al eliminar el horario', 'error');
            }
        } catch (error) {
            console.error('Error al eliminar horario:', error);
            showSnackbar(
                error.response?.data?.message || 
                'Error al eliminar el horario. Por favor, intente nuevamente.',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    const getHorariosPorDia = (dia) => {
        const horariosDelDia = horarios.filter(h => h.dia_semana === dia);
        console.log(`Horarios para ${dia}:`, horariosDelDia);
        return horariosDelDia;
    };

    const handleOpenExperticia = () => {
        setOpenExperticia(true);
    };

    const handleCloseExperticia = () => {
        setOpenExperticia(false);
    };

    const handleGuardarExperticia = async () => {
        try {
            setLoadingExperticia(true);
            const response = await api.put(`/usuarios/${docenteId}`, {
                experticia: experticia
            });
            
            if (response.data.success) {
                handleCloseExperticia();
                setError('');
            } else {
                setError(response.data.message || 'Error al actualizar la experticia');
            }
        } catch (error) {
            console.error('Error al actualizar experticia:', error);
            setError('Error al actualizar la experticia. Por favor, intente nuevamente.');
        } finally {
            setLoadingExperticia(false);
        }
    };

    if (!docenteId) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    No se pudo obtener la información del docente. Por favor, inicie sesión nuevamente.
                </Alert>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Gestión de Horarios</Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleOpen()}
                    disabled={loading}
                >
                    Agregar Horario
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {/* Vista de Calendario Semanal */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Calendario Semanal
                            </Typography>
                            <Grid container spacing={1}>
                                {DIAS_SEMANA.map((dia) => (
                                    <Grid item xs={12} sm={6} md={4} lg={2} key={dia}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    {dia}
                                                </Typography>
                                                {getHorariosPorDia(dia).length > 0 ? (
                                                    getHorariosPorDia(dia).map((horario) => (
                                                        <Box 
                                                            key={horario.id}
                                                            sx={{ 
                                                                p: 1, 
                                                                mb: 1, 
                                                                bgcolor: 'primary.light',
                                                                color: 'white',
                                                                borderRadius: 1,
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center'
                                                            }}
                                                        >
                                                            <Box>
                                                                <Typography variant="body2">
                                                                    {horario.hora_inicio} - {horario.hora_fin}
                                                                </Typography>
                                                                <Typography variant="caption">
                                                                    Salón: {horario.salon}
                                                                </Typography>
                                                            </Box>
                                                            <Box>
                                                                <IconButton 
                                                                    size="small" 
                                                                    onClick={() => handleOpen(horario)}
                                                                    sx={{ color: 'white' }}
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                                <IconButton 
                                                                    size="small" 
                                                                    onClick={() => handleDelete(horario.id)}
                                                                    sx={{ color: 'white' }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                    ))
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Sin horarios
                                                    </Typography>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Sección de Experticia */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Experticia</Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleOpenExperticia}
                                    disabled={loadingExperticia}
                                >
                                    Editar Experticia
                                </Button>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            {loadingExperticia ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {experticia || 'No hay experticia registrada'}
                                </Typography>
                            )}
                        </Paper>
                    </Grid>

                    {/* Tabla de Horarios */}
                    <Grid item xs={12}>
                        <Paper>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Día</TableCell>
                                            <TableCell>Hora Inicio</TableCell>
                                            <TableCell>Hora Fin</TableCell>
                                            <TableCell>Salón</TableCell>
                                            <TableCell>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {horarios && horarios.length > 0 ? (
                                            horarios.map((horario) => (
                                                <TableRow key={horario.id}>
                                                    <TableCell>{horario.dia_semana}</TableCell>
                                                    <TableCell>{horario.hora_inicio}</TableCell>
                                                    <TableCell>{horario.hora_fin}</TableCell>
                                                    <TableCell>{horario.salon}</TableCell>
                                                    <TableCell>
                                                        <IconButton 
                                                            onClick={() => handleOpen(horario)} 
                                                            color="primary"
                                                            disabled={loading}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton 
                                                            onClick={() => handleDelete(horario.id)} 
                                                            color="error"
                                                            disabled={loading}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">
                                                    No hay horarios registrados
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {editingHorario ? 'Editar Horario' : 'Agregar Horario'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            select
                            label="Día"
                            value={formData.dia}
                            onChange={(e) => setFormData({ ...formData, dia: e.target.value })}
                            margin="normal"
                            required
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="">Seleccione un día</option>
                            {DIAS_SEMANA.map((dia) => (
                                <option key={dia} value={dia}>{dia}</option>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            label="Hora Inicio"
                            type="time"
                            value={formData.hora_inicio}
                            onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                            margin="normal"
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            fullWidth
                            label="Hora Fin"
                            type="time"
                            value={formData.hora_fin}
                            onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                            margin="normal"
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            fullWidth
                            label="Salón"
                            value={formData.salon}
                            onChange={(e) => setFormData({ ...formData, salon: e.target.value })}
                            margin="normal"
                            required
                            placeholder="Ej: 101, Aula 2, etc."
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : (editingHorario ? 'Actualizar' : 'Guardar')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo para editar experticia */}
            <Dialog open={openExperticia} onClose={handleCloseExperticia}>
                <DialogTitle>Editar Experticia</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Experticia"
                        value={experticia}
                        onChange={(e) => setExperticia(e.target.value)}
                        margin="normal"
                        placeholder="Ingrese su experticia o áreas de conocimiento..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseExperticia} disabled={loadingExperticia}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleGuardarExperticia} 
                        variant="contained" 
                        color="primary"
                        disabled={loadingExperticia}
                    >
                        {loadingExperticia ? <CircularProgress size={24} /> : 'Guardar'}
                    </Button>
                </DialogActions>
            </Dialog>

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

export default HorariosDocente; 