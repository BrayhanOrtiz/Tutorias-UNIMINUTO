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
    MenuItem
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../components/NotificationSystem';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import esLocale from 'date-fns/locale/es';

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
    const [formData, setFormData] = useState({
        dia: '',
        hora_inicio: null,
        hora_fin: null,
        salon: ''
    });

    const { user } = useAuth();
    const { showNotification } = useNotification();
    const docenteId = user?.id;

    console.log('Usuario actual:', user);
    console.log('ID del docente:', docenteId);

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
            }
        } catch (error) {
            console.error('Error al cargar horarios:', error);
            console.error('Detalles del error:', error.response?.data);
            console.error('Estado del error:', error.response?.status);
            console.error('Headers de la respuesta:', error.response?.headers);
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
        } finally {
            setLoadingExperticia(false);
        }
    };

    const handleOpen = (horario = null) => {
        if (horario) {
            setEditingHorario(horario);
            const [horaInicioStr, minInicioStr, segInicioStr] = horario.hora_inicio.split(':');
            const horaInicioDate = new Date();
            horaInicioDate.setHours(parseInt(horaInicioStr, 10), parseInt(minInicioStr, 10), parseInt(segInicioStr, 10));
            horaInicioDate.setFullYear(1900, 0, 1);

            const [horaFinStr, minFinStr, segFinStr] = horario.hora_fin.split(':');
            const horaFinDate = new Date();
            horaFinDate.setHours(parseInt(horaFinStr, 10), parseInt(minFinStr, 10), parseInt(segFinStr, 10));
            horaFinDate.setFullYear(1900, 0, 1);

            setFormData({
                dia: horario.dia_semana,
                hora_inicio: horaInicioDate,
                hora_fin: horaFinDate,
                salon: horario.salon
            });
        } else {
            setEditingHorario(null);
            setFormData({
                dia: '',
                hora_inicio: null,
                hora_fin: null,
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
            hora_inicio: null,
            hora_fin: null,
            salon: ''
        });
        setError('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTimeChange = (name, dateValue) => {
        setFormData(prev => ({
            ...prev,
            [name]: dateValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!formData.dia || !formData.hora_inicio || !formData.hora_fin || !formData.salon) {
                setError('Todos los campos son requeridos');
                return;
            }

            if (!(formData.hora_inicio instanceof Date) || isNaN(formData.hora_inicio.getTime()) ||
                !(formData.hora_fin instanceof Date) || isNaN(formData.hora_fin.getTime())) {
                setError('Por favor, seleccione horas válidas');
                return;
            }

            if (formData.hora_inicio.getTime() >= formData.hora_fin.getTime()) {
                setError('La hora de inicio debe ser menor que la hora de fin');
                return;
            }

            const formatTimeToHHMMSS = (date) => {
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');
                return `${hours}:${minutes}:${seconds}`;
            };

            const horaInicioFormatted = formatTimeToHHMMSS(formData.hora_inicio);
            const horaFinFormatted = formatTimeToHHMMSS(formData.hora_fin);

            const horarioData = {
                dia_semana: formData.dia,
                hora_inicio: horaInicioFormatted,
                hora_fin: horaFinFormatted,
                salon: formData.salon,
                usuario_id: docenteId
            };

            console.log('Enviando datos del horario:', horarioData);

            let response;
            if (editingHorario) {
                response = await api.put(
                    `/horarios/${editingHorario.id}`,
                    horarioData
                );
            } else {
                response = await api.post('/horarios', horarioData);
            }
            
            console.log('Respuesta del servidor:', response.data);
            
            if (response.data.success) {
                handleClose();
                await cargarHorarios();
                showNotification(response.data.message || 'Horario guardado exitosamente');
            } else {
                setError(response.data.message || 'Error al guardar el horario');
            }
        } catch (error) {
            console.error('Error al guardar horario:', error);
            const errorMessage = error.response?.data?.message || 'Error al guardar el horario. Por favor, intente nuevamente.';
            setError(errorMessage);
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
                await cargarHorarios();
                showNotification('Horario eliminado exitosamente');
            } else {
                showNotification(response.data.message || 'Error al eliminar el horario', 'error');
            }
        } catch (error) {
            console.error('Error al eliminar horario:', error);
            showNotification(
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
                showNotification('Experticia actualizada exitosamente');
                handleCloseExperticia();
            } else {
                showNotification(response.data.message || 'Error al actualizar la experticia', 'error');
            }
        } catch (error) {
            console.error('Error al actualizar experticia:', error);
            console.error('Detalles del error:', error.response?.data);
            console.error('Estado del error:', error.response?.status);
            showNotification(
                error.response?.data?.message || 
                'Error al actualizar la experticia. Por favor, intente nuevamente.',
                'error'
            );
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
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Día"
                                    name="dia"
                                    value={formData.dia}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                >
                                    {DIAS_SEMANA.map((dia) => (
                                        <MenuItem key={dia} value={dia}>
                                            {dia}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
                                    <TimePicker
                                        label="Hora Inicio"
                                        value={formData.hora_inicio}
                                        onChange={(newValue) => handleTimeChange('hora_inicio', newValue)}
                                        renderInput={(params) => <TextField {...params} fullWidth margin="dense" required />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
                                    <TimePicker
                                        label="Hora Fin"
                                        value={formData.hora_fin}
                                        onChange={(newValue) => handleTimeChange('hora_fin', newValue)}
                                        renderInput={(params) => <TextField {...params} fullWidth margin="dense" required />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Salón"
                                    value={formData.salon}
                                    onChange={(e) => setFormData({ ...formData, salon: e.target.value })}
                                    margin="normal"
                                    required
                                    placeholder="Ej: A101, B205, etc."
                                />
                            </Grid>
                        </Grid>
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
        </Box>
    );
};

export default HorariosDocente; 