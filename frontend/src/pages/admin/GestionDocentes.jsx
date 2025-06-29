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
    const [formErrors, setFormErrors] = useState({});
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
        setFormErrors({}); // Limpiar errores al abrir el diálogo
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormErrors({}); // Limpiar errores al cerrar
    };

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'id':
                if (!/^[0-9]*$/.test(value)) {
                    error = 'El ID solo debe contener números';
                } else if (value.length > 8) {
                    error = 'El ID no debe exceder los 8 dígitos';
                }
                break;
            case 'nombre':
                if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/.test(value)) {
                    error = 'El nombre solo debe contener letras y ñ';
                }
                break;
            case 'apellido':
                if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/.test(value)) {
                    error = 'El apellido solo debe contener letras y ñ';
                }
                break;
            case 'correo_institucional':
                if (!/^[^\s@]+@uniminuto\.edu\.co$/.test(value)) {
                    error = 'Debe ser un correo @uniminuto.edu.co válido';
                }
                break;
            case 'contraseña':
                if (value.length > 50) {
                    error = 'La contraseña no debe exceder los 50 caracteres';
                }
                break;
            case 'experticia':
                if (value.length > 200) {
                    error = 'La experticia no debe exceder los 200 caracteres';
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Validar el campo al cambiar
        const error = validateField(name, value);
        setFormErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;
        // Validar todos los campos
        Object.keys(formData).forEach(key => {
             // No validar contraseña si estamos editando y el campo está vacío
            if (isEditing && key === 'contraseña' && formData[key] === '') {
                return; 
            }
            const error = validateField(key, formData[key]);
            if (error) {
                errors[key] = error;
                isValid = false;
            }
        });
        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showNotification('Por favor, corrija los errores en el formulario', 'warning');
            return;
        }

        // Si estamos agregando y el campo de contraseña está vacío, mostrar error (es requerido)
        if (!isEditing && !formData.contraseña) {
             setFormErrors(prev => ({ ...prev, contraseña: 'La contraseña es requerida para nuevos docentes' }));
             showNotification('Por favor, complete el campo de contraseña', 'warning');
             return;
        }

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

    const handleExportTutorias = async (docenteId) => {
        try {
            setLoading(true);
            // Calcular la fecha de inicio (6 meses atrás) y la fecha de fin (hoy)
            const fechaFin = new Date();
            // Ajustar la fecha fin para incluir todo el día actual
            fechaFin.setHours(23, 59, 59, 999);
            
            const fechaInicio = new Date();
            fechaInicio.setMonth(fechaInicio.getMonth() - 6);
            // Ajustar la fecha inicio para comenzar desde el inicio del día
            fechaInicio.setHours(0, 0, 0, 0);

            // Formatear las fechas a 'YYYY-MM-DD'
            const formatFecha = (date) => {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const fechaInicioFormatted = formatFecha(fechaInicio);
            const fechaFinFormatted = formatFecha(fechaFin);

            console.log('Fechas del reporte:', {
                inicio: fechaInicioFormatted,
                fin: fechaFinFormatted
            });

            const response = await api.get('/reportes/tutorias-docente', {
                params: { 
                    docente_id: docenteId,
                    fecha_inicio: fechaInicioFormatted,
                    fecha_fin: fechaFinFormatted
                },
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Crear un objeto URL para el blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            
            // Crear un enlace temporal y simular el clic para descargar
            const link = document.createElement('a');
            link.href = url;
            
            // Obtener el nombre del docente para el nombre del archivo
            const docente = docentes.find(d => d.id === docenteId);
            // Asegurarse de tener un docente antes de intentar acceder a sus propiedades
            const nombreArchivo = docente ? `reporte_tutorias_${docente.nombre}_${docente.apellido}_${new Date().toISOString().split('T')[0]}.xlsx` : `reporte_tutorias_${docenteId}_${new Date().toISOString().split('T')[0]}.xlsx`;
            
            link.setAttribute('download', nombreArchivo);
            document.body.appendChild(link);
            link.click();
            
            // Limpiar
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            showNotification('Reporte de tutorías exportado exitosamente', 'success');
            
            // Actualizar la lista de tutorías después de generar el reporte
            await cargarDocentes();
        } catch (error) {
            console.error('Error al exportar tutorías:', error);
            showNotification('Error al exportar el reporte de tutorías', 'error');
        } finally {
            setLoading(false);
        }
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
                                    error={!!formErrors.id}
                                    helperText={formErrors.id}
                                    // Deshabilitar edición de ID si estamos editando
                                    disabled={isEditing}
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
                                    error={!!formErrors.nombre}
                                    helperText={formErrors.nombre}
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
                                    error={!!formErrors.apellido}
                                    helperText={formErrors.apellido}
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
                                    error={!!formErrors.correo_institucional}
                                    helperText={formErrors.correo_institucional}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required={!isEditing} // Requerido solo al agregar
                                    fullWidth
                                    label="Contraseña"
                                    name="contraseña"
                                    type="password"
                                    value={formData.contraseña}
                                    onChange={handleInputChange}
                                    error={!!formErrors.contraseña}
                                    helperText={formErrors.contraseña || (isEditing ? 'Dejar vacío para no cambiar' : '')}
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
                                    error={!!formErrors.experticia}
                                    helperText={formErrors.experticia}
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