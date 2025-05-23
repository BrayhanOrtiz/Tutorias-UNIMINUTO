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
import { useNotification } from '../../components/NotificationSystem';

const TutoriasDocente = () => {
    const [tutorias, setTutorias] = useState([]);
    const [selectedTutoria, setSelectedTutoria] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [tutoriaToDelete, setTutoriaToDelete] = useState(null);
    const [observaciones, setObservaciones] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const docenteId = user?.id;
    const isEstudiante = user?.role === 'estudiante';
    const { showNotification } = useNotification();

    useEffect(() => {
        if (docenteId) {
            cargarTutorias();
        }
    }, [docenteId]);

    const cargarTutorias = async () => {
        try {
            if (!docenteId) {
                console.error('No hay ID de docente disponible');
                showNotification('Error: No hay ID de docente disponible', 'error');
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
                showNotification(response.data.error || 'Error al cargar las tutorías', 'error');
            }
        } catch (error) {
            console.error('Error al cargar tutorías:', error);
            console.error('Detalles del error:', error.response?.data);
            console.error('Estado del error:', error.response?.status);
            console.error('Headers de la respuesta:', error.response?.headers);
            showNotification(
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
            showNotification('Asistencia registrada correctamente');
        } catch (error) {
            console.error('Error al registrar asistencia:', error);
            showNotification('Error al registrar la asistencia', 'error');
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
            setLoading(true);
            // Actualizar el estado local inmediatamente
            setTutorias(prevTutorias => 
                prevTutorias.map(tutoria => 
                    tutoria.id === tutoriaId 
                        ? { ...tutoria, firma_docente_habilitada: true }
                        : tutoria
                )
            );

            const response = await api.post(`/tutorias/${tutoriaId}/habilitar-firma`, {
                docente_id: docenteId,
                tutoria_id: tutoriaId
            });
            
            console.log('Respuesta del servidor:', response.data);
            
            if (response.data.success) {
                // Asegurarnos de que el estado se mantenga actualizado
                setTutorias(prevTutorias => 
                    prevTutorias.map(tutoria => 
                        tutoria.id === tutoriaId 
                            ? { ...tutoria, firma_docente_habilitada: true }
                            : tutoria
                    )
                );
                // Mostrar notificación de éxito
                showNotification('Firma habilitada exitosamente', 'success');
            } else {
                // Si no es éxito, mostrar error
                showNotification(response.data.message || 'Error al habilitar la firma', 'error');
            }
        } catch (error) {
            console.error('Error al habilitar firma:', error);
            console.error('Detalles del error:', error.response?.data);
            // Revertir el estado local en caso de error
            setTutorias(prevTutorias => 
                prevTutorias.map(tutoria => 
                    tutoria.id === tutoriaId 
                        ? { ...tutoria, firma_docente_habilitada: false }
                        : tutoria
                )
            );

            // Determinar el mensaje de error a mostrar
            const backendErrorMessage = error.response?.data?.message;
            let displayMessage = 'Error al habilitar la firma. Por favor, intente nuevamente.';

            // Verificar si el mensaje del backend indica un problema de horario (ej: si contiene 'horario', 'hora', 'rango', etc.)
            // **Nota:** La efectividad de esto depende del mensaje exacto que envía el backend.
            if (backendErrorMessage) {
                const lowerCaseMessage = backendErrorMessage.toLowerCase();
                if (lowerCaseMessage.includes('horario') || lowerCaseMessage.includes('hora') || lowerCaseMessage.includes('rango') || lowerCaseMessage.includes('time')) {
                     displayMessage = 'No puedes habilitar la firma si no estas en el horario acordado';
                } else {
                     displayMessage = backendErrorMessage; // Usar el mensaje del backend si no es de horario
                }
            }

            showNotification(
                displayMessage,
                'error'
            );

        } finally {
            setLoading(false);
        }
    };

    const handleHabilitarFirmaEstudiante = async (tutoriaId) => {
        try {
            const response = await api.put(`/tutorias/${tutoriaId}/habilitar-firma-estudiante`, {
                estudiante_id: selectedTutoria.estudiante_id
            });
            if (response.data.success) {
                cargarTutorias();
                showNotification('Firma del estudiante habilitada correctamente');
            }
        } catch (error) {
            console.error('Error al habilitar firma del estudiante:', error);
            showNotification(error.response?.data?.error || 'Error al habilitar la firma del estudiante', 'error');
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
            showNotification('No se puede eliminar esta tutoría porque ya ha sido firmada o habilitada para firma', 'warning');
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
                showNotification('Tutoría eliminada exitosamente');
                handleCloseDeleteDialog();
                await cargarTutorias();
            } else {
                showNotification('Error al eliminar la tutoría', 'error');
            }
        } catch (error) {
            console.error('Error al eliminar tutoría:', error);
            
            if (error.response?.status === 200 || error.response?.status === 204) {
                showNotification('Tutoría eliminada exitosamente');
                handleCloseDeleteDialog();
                await cargarTutorias();
            } else {
                showNotification(
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
                                    {getEstadoChip(tutoria)}
                                </TableCell>
                                <TableCell>
                                    {tutoria.firma_docente_habilitada ? (
                                        <Chip 
                                            label="Firma Habilitada" 
                                            color="success" 
                                            size="small"
                                            sx={{ 
                                                backgroundColor: '#e8f5e9',
                                                color: '#2e7d32',
                                                '& .MuiChip-label': {
                                                    fontWeight: 500
                                                }
                                            }}
                                        />
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="primary"
                                            onClick={() => handleHabilitarFirma(tutoria.id)}
                                            disabled={loading}
                                            sx={{
                                                minWidth: '120px'
                                            }}
                                        >
                                            {loading ? 'Habilitando...' : 'Habilitar Firma'}
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
        </Box>
    );
};

export default TutoriasDocente; 