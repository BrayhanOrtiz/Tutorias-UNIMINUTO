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
    Alert
} from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const TutoriasDocente = () => {
    const [tutorias, setTutorias] = useState([]);
    const [selectedTutoria, setSelectedTutoria] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [tutoriaToDelete, setTutoriaToDelete] = useState(null);
    const [observaciones, setObservaciones] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const { user } = useAuth();
    const docenteId = user?.id;
    const isEstudiante = user?.role === 'estudiante';

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
        if (docenteId) {
            cargarTutorias();
        }
    }, [docenteId]);

    const cargarTutorias = async () => {
        try {
            if (!docenteId) {
                console.error('No hay ID de docente disponible');
                showSnackbar('Error: No hay ID de docente disponible', 'error');
                return;
            }

            console.log('Intentando cargar tutorías para docente:', docenteId);
            console.log('Token de autenticación:', localStorage.getItem('token'));
            
            const response = await api.get(`/tutorias/docente/${docenteId}`);
            console.log('Respuesta del servidor:', response.data);
            
            if (response.data.success) {
                setTutorias(response.data.data || []);
                console.log('Tutorías cargadas:', response.data.data);
            } else {
                console.error('Error en la respuesta del servidor:', response.data);
                showSnackbar(response.data.error || 'Error al cargar las tutorías', 'error');
            }
        } catch (error) {
            console.error('Error al cargar tutorías:', error);
            console.error('Detalles del error:', error.response?.data);
            console.error('Estado del error:', error.response?.status);
            console.error('Headers de la respuesta:', error.response?.headers);
            showSnackbar(
                error.response?.data?.error || 
                error.response?.data?.message || 
                'Error al cargar las tutorías', 
                'error'
            );
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

    const handleRegistrarAsistencia = async () => {
        if (!selectedTutoria) return;

        try {
            await api.post('/asistencia-tutoria', {
                tutoria_id: selectedTutoria.id,
                estudiante_id: selectedTutoria.estudiante_id,
                observaciones: observaciones
            });
            handleCloseDialog();
            cargarTutorias();
            showSnackbar('Asistencia registrada correctamente');
        } catch (error) {
            console.error('Error al registrar asistencia:', error);
            showSnackbar('Error al registrar la asistencia', 'error');
        }
    };

    const getEstadoChip = (tutoria) => {
        if (tutoria.firma_docente_habilitada && tutoria.firmada_estudiante) {
                return <Chip label="Completada" color="success" />;
        } else if (tutoria.firma_docente_habilitada) {
            return <Chip label="Pendiente de firma del estudiante" color="warning" />;
        } else {
            return <Chip label="Pendiente" color="default" />;
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

    const handleHabilitarFirma = async (tutoriaId) => {
        try {
            const response = await api.post(`/tutorias/${tutoriaId}/habilitar-firma`, {
                docente_id: docenteId
            });
            
            if (response.data) {
                showSnackbar('Firma habilitada exitosamente');
                await cargarTutorias();
            } else {
                showSnackbar(response.data.error || 'Error al habilitar la firma', 'error');
            }
        } catch (error) {
            console.error('Error al habilitar firma:', error);
            if (error.response?.status === 200) {
                showSnackbar('Firma habilitada exitosamente');
                await cargarTutorias();
            } else {
                showSnackbar(
                    error.response?.data?.error || 
                    'Error al habilitar la firma. Por favor, intente nuevamente.',
                    'error'
                );
            }
        }
    };

    const handleHabilitarFirmaEstudiante = async (tutoriaId) => {
        try {
            const response = await api.put(`/tutorias/${tutoriaId}/habilitar-firma-estudiante`, {
                estudiante_id: selectedTutoria.estudiante_id
            });
            if (response.data.success) {
                cargarTutorias();
                showSnackbar('Firma del estudiante habilitada correctamente');
            }
        } catch (error) {
            console.error('Error al habilitar firma del estudiante:', error);
            showSnackbar(error.response?.data?.error || 'Error al habilitar la firma del estudiante', 'error');
        }
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'COMPLETADA':
                return 'success';
            case 'CANCELADA':
                return 'error';
            case 'EN_PROGRESO':
                return 'warning';
            default:
                return 'default';
        }
    };

    const canDeleteTutoria = (tutoria) => {
        if (isEstudiante) {
            // El estudiante solo puede eliminar si no está firmada ni habilitada para firma
            return !tutoria.firma_docente_habilitada && !tutoria.firmada_estudiante;
        }
        // El docente puede eliminar en cualquier momento
        return true;
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
                showSnackbar('Error al eliminar la tutoría', 'error');
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

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Tutorías
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Estudiante</TableCell>
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
                                <TableCell>{tutoria.nombre_estudiante}</TableCell>
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
                                        <Chip label="OK" color="success" size="small" />
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
                                        <Chip label="Firma Habilitada" color="success" size="small" />
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="primary"
                                            onClick={() => handleHabilitarFirma(tutoria.id)}
                                        >
                                            Habilitar Firma
                                        </Button>
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

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Detalles de la Tutoría</DialogTitle>
                <DialogContent>
                    {selectedTutoria && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Estudiante: {selectedTutoria.nombre_estudiante}
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
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        onClick={handleRegistrarAsistencia}
                        variant="contained"
                        color="primary"
                    >
                        Registrar Asistencia
                    </Button>
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
                        ¿Está seguro que desea eliminar la tutoría con el estudiante {tutoriaToDelete?.nombre_estudiante}?
                        Esta acción no se puede deshacer.
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

export default TutoriasDocente; 