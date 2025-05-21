import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';
import { Visibility as VisibilityIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const TutoriasEstudiante = () => {
    const [tutorias, setTutorias] = useState([]);
    const [selectedTutoria, setSelectedTutoria] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [tutoriaToDelete, setTutoriaToDelete] = useState(null);
    const [observaciones, setObservaciones] = useState('');
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const { user } = useAuth();
    const estudianteId = user?.id;

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
        if (estudianteId) {
            cargarTutorias();
        }
    }, [estudianteId]);

    const cargarTutorias = async () => {
        try {
            setLoading(true);
            if (!estudianteId) {
                throw new Error('No hay ID de estudiante disponible');
            }

            const response = await api.get(`/tutorias/estudiante/${estudianteId}`);
            console.log('Respuesta del servidor:', response.data); // Para depuración
            
            // Verificar si la respuesta es un array directamente
            if (Array.isArray(response.data)) {
                setTutorias(response.data);
            }
            // Verificar si la respuesta tiene el formato esperado
            else if (response.data && response.data.data) {
                setTutorias(response.data.data);
            }
            // Si la respuesta tiene success: false
            else if (response.data && response.data.success === false) {
                throw new Error(response.data.error || 'Error al cargar las tutorías');
            }
            // Si no hay datos
            else {
                setTutorias([]);
            }
        } catch (error) {
            console.error('Error al cargar tutorías:', error);
            console.error('Detalles del error:', error.response?.data); // Para depuración
            
            let errorMessage = 'Error al cargar las tutorías';
            
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            showSnackbar(errorMessage, 'error');
            setTutorias([]); // Establecer array vacío en caso de error
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (tutoria) => {
        setSelectedTutoria(tutoria);
        setObservaciones('');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTutoria(null);
        setObservaciones('');
    };

    const canDeleteTutoria = (tutoria) => {
        return !tutoria.firma_docente_habilitada && !tutoria.firmada_estudiante;
    };

    const handleOpenDeleteDialog = (tutoria) => {
        if (!canDeleteTutoria(tutoria)) {
            showSnackbar('No se puede eliminar esta tutoría porque ya ha sido firmada o habilitada para firma', 'warning');
            return;
        }
        setTutoriaToDelete(tutoria);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setTutoriaToDelete(null);
    };

    const handleEliminarTutoria = async () => {
        if (!tutoriaToDelete) return;

        try {
            const response = await api.delete(`/tutorias/${tutoriaToDelete.id}`);
            
            if (response.status === 200 || response.status === 204) {
                showSnackbar('Tutoría eliminada exitosamente');
                handleCloseDeleteDialog();
                await cargarTutorias();
            } else {
                throw new Error('Error al eliminar la tutoría');
            }
        } catch (error) {
            console.error('Error al eliminar tutoría:', error);
            
            if (error.response?.status === 200 || error.response?.status === 204) {
                showSnackbar('Tutoría eliminada exitosamente');
                handleCloseDeleteDialog();
                await cargarTutorias();
            } else {
                showSnackbar(
                    error.response?.data?.message || 
                    'Error al eliminar la tutoría. Por favor, intente nuevamente.',
                    'error'
                );
            }
        }
    };

    const handleFirmarTutoria = async (tutoriaId) => {
        try {
            // Verificar que la tutoría existe y está habilitada para firma
            const tutoria = tutorias.find(t => t.id === tutoriaId);
            if (!tutoria) {
                throw new Error('Tutoría no encontrada');
            }
            if (!tutoria.firma_docente_habilitada) {
                throw new Error('El docente aún no ha habilitado la firma para esta tutoría');
            }
            if (tutoria.firmada_estudiante) {
                throw new Error('Ya has firmado esta tutoría');
            }

            console.log('Intentando firmar tutoría:', {
                tutoria_id: tutoriaId,
                estudiante_id: estudianteId,
                observaciones: observaciones || 'Asistencia registrada por el estudiante'
            });

            const response = await api.post('/asistencia-tutoria', {
                tutoria_id: tutoriaId,
                estudiante_id: estudianteId,
                observaciones: observaciones || 'Asistencia registrada por el estudiante'
            });

            console.log('Respuesta del servidor:', response.data);

            // Verificar si la respuesta es exitosa
            if (response.status === 200 || response.status === 201) {
                showSnackbar('Asistencia registrada exitosamente');
                await cargarTutorias();
            } else if (response.data && response.data.success === false) {
                throw new Error(response.data.error || 'Error al registrar la asistencia');
            } else {
                // Si la respuesta no tiene el formato esperado pero fue exitosa
                showSnackbar('Asistencia registrada exitosamente');
                await cargarTutorias();
            }
        } catch (error) {
            console.error('Error al firmar tutoría:', error);
            console.error('Detalles del error:', error.response?.data);

            let errorMessage = 'Error al registrar la asistencia';
            
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            showSnackbar(errorMessage, 'error');
        }
    };

    const getEstadoVariant = (estado) => {
        if (estado.firma_docente_habilitada && estado.firmada_estudiante) {
            return 'success';
        } else if (estado.firma_docente_habilitada) {
            return 'warning';
        } else {
            return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Mis Tutorías
            </Typography>

            {tutorias.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                    No tienes tutorías agendadas actualmente
                </Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Docente</TableCell>
                                <TableCell>Tema</TableCell>
                                <TableCell>Fecha y Hora</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Firma</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tutorias.map((tutoria) => (
                                <TableRow key={tutoria.id}>
                                    <TableCell>{tutoria.nombre_docente}</TableCell>
                                    <TableCell>{tutoria.nombre_tema}</TableCell>
                                    <TableCell>
                                        {(() => {
                                            const fecha = new Date(tutoria.fecha_hora_agendada);
                                            return fecha.toLocaleString('es-ES', {
                                                timeZone: 'America/Bogota',
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false
                                            });
                                        })()}
                                    </TableCell>
                                    <TableCell>
                                        {tutoria.firma_docente_habilitada && tutoria.firmada_estudiante ? (
                                            <Chip label="Completada" color="success" size="small" />
                                        ) : (
                                            <Chip
                                                label={tutoria.estado || 'PENDIENTE'}
                                                color={getEstadoVariant(tutoria)}
                                                size="small"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {tutoria.firma_docente_habilitada ? (
                                            tutoria.firmada_estudiante ? (
                                                <Chip label="Firmada" color="success" size="small" />
                                            ) : (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleFirmarTutoria(tutoria.id)}
                                                >
                                                    Firmar
                                                </Button>
                                            )
                                        ) : (
                                            <Chip label="Pendiente de firma del docente" color="warning" size="small" />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <IconButton
                                                onClick={() => handleOpenDialog(tutoria)}
                                                color="primary"
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                            {canDeleteTutoria(tutoria) && (
                                                <IconButton
                                                    onClick={() => handleOpenDeleteDialog(tutoria)}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Detalles de la Tutoría</DialogTitle>
                <DialogContent>
                    {selectedTutoria && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Docente: {selectedTutoria.nombre_docente}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Tema: {selectedTutoria.nombre_tema}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Fecha: {new Date(selectedTutoria.fecha_hora_agendada).toLocaleDateString()}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Hora: {new Date(selectedTutoria.fecha_hora_agendada).toLocaleTimeString()}
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Observaciones"
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                margin="normal"
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Está seguro que desea eliminar esta tutoría? Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleEliminarTutoria} color="error" variant="contained">
                        Eliminar
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

export default TutoriasEstudiante; 