import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Download as DownloadIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import api from '../../services/api'; // Asegúrate de que la instancia 'api' está correctamente configurada
import { useNotification } from '../../components/NotificationSystem';

const GestionDocentes = () => {
    const [docentes, setDocentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        nombre: '',
        apellido: '',
        correo_institucional: '',
        contraseña: '',
        fecha_nacimiento: new Date().toISOString().split('T')[0],
        experticia: ''
    });
    const { showNotification } = useNotification();

    const cargarDocentes = async () => {
        try {
            setLoading(true);
            const response = await api.get('/usuarios/rol/2');
            if (response.data.success) {
                setDocentes(response.data.data);
            } else {
                setError(response.data.message || 'Error al cargar los docentes');
            }
        } catch (err) {
            console.error('Error al cargar docentes:', err);
            setError(err.response?.data?.message || 'Error de conexión o servidor al cargar docentes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDocentes();
    }, []);

    const handleOpenDialog = () => {
        setOpenDialog(true);
        setIsEditing(false);
        setFormData({
            id: '',
            nombre: '',
            apellido: '',
            correo_institucional: '',
            contraseña: '',
            fecha_nacimiento: new Date().toISOString().split('T')[0],
            experticia: ''
        });
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (isEditing) {
                response = await api.put(`/usuarios/${formData.id}`, formData);
            } else {
                response = await api.post('/usuarios/docentes', formData);
            }

            if (response.data.success) {
                showNotification(
                    isEditing ? 'Docente actualizado exitosamente' : 'Docente agregado exitosamente',
                    'success'
                );
                handleCloseDialog();
                cargarDocentes();
            } else {
                showNotification(
                    response.data.message || `Error al ${isEditing ? 'actualizar' : 'agregar'} el docente`,
                    'error'
                );
            }
        } catch (error) {
            console.error(`Error al ${isEditing ? 'actualizar' : 'agregar'} docente:`, error);
            showNotification(
                error.response?.data?.message || `Error al ${isEditing ? 'actualizar' : 'agregar'} el docente`,
                'error'
            );
        }
    };

    const handleEdit = (docente) => {
        setOpenDialog(true);
        setIsEditing(true);
        setFormData({
            id: docente.id,
            nombre: docente.nombre,
            apellido: docente.apellido,
            correo_institucional: docente.correo_institucional,
            contraseña: '', // No mostramos la contraseña por seguridad
            fecha_nacimiento: docente.fecha_nacimiento,
            experticia: docente.experticia || ''
        });
    };

    const handleDelete = async (docenteId) => {
        if (!window.confirm('¿Está seguro de eliminar este docente?')) {
            return;
        }

        try {
            const response = await api.delete(`/usuarios/${docenteId}`);
            if (response.data.success) {
                showNotification('Docente eliminado exitosamente', 'success');
                cargarDocentes();
            } else {
                showNotification(response.data.message || 'Error al eliminar el docente', 'error');
            }
        } catch (error) {
            console.error('Error al eliminar docente:', error);
            showNotification(
                error.response?.data?.message || 'Error al eliminar el docente',
                'error'
            );
        }
    };

    const handleExportTutorias = (docenteId) => {
        console.log('Exportar tutorías de docente ID:', docenteId);
        // Implementar lógica para exportar tutorías
    };

    // --- Renderizado --- //

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Gestión de Docentes
            </Typography>

            <Box sx={{ mb: 2 }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleOpenDialog}
                >
                    Agregar Nuevo Docente
                </Button>
            </Box>

            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Apellido</TableCell>
                                <TableCell>Correo Institucional</TableCell>
                                {/* Puedes añadir más columnas si es necesario */}
                                <TableCell align="right">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {docentes.length > 0 ? (
                                docentes.map((docente) => (
                                    <TableRow key={docente.id}>
                                        <TableCell>{docente.id}</TableCell>
                                        <TableCell>{docente.nombre}</TableCell>
                                        <TableCell>{docente.apellido}</TableCell>
                                        <TableCell>{docente.correo_institucional}</TableCell>
                                        {/* Renderizar más datos si se muestran en la tabla */}
                                        <TableCell align="right">
                                            {/* Botones de Acción */}
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleEdit(docente)}
                                                color="primary"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleDelete(docente.id)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleExportTutorias(docente.id)}
                                                color="success"
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No hay docentes registrados
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? 'Editar Docente' : 'Agregar Nuevo Docente'}</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="ID"
                                    name="id"
                                    value={formData.id}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Apellido"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Correo Institucional"
                                    name="correo_institucional"
                                    type="email"
                                    value={formData.correo_institucional}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Contraseña"
                                    name="contraseña"
                                    type="password"
                                    value={formData.contraseña}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
                                    <DatePicker
                                        label="Fecha de Nacimiento"
                                        value={formData.fecha_nacimiento ? new Date(formData.fecha_nacimiento) : null}
                                        onChange={(newValue) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                fecha_nacimiento: newValue ? newValue.toISOString().split('T')[0] : ''
                                            }));
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                variant: "outlined"
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Experticia"
                                    name="experticia"
                                    value={formData.experticia}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GestionDocentes; 