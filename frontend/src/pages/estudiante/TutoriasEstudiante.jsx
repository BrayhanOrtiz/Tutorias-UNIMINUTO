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
    Alert,
    CircularProgress,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Rating
} from '@mui/material';
import { Visibility as VisibilityIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../components/NotificationSystem';

const TutoriasEstudiante = () => {
    const [tutorias, setTutorias] = useState([]);
    const [selectedTutoria, setSelectedTutoria] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEncuestaDialog, setOpenEncuestaDialog] = useState(false);
    const [tutoriaToDelete, setTutoriaToDelete] = useState(null);
    const [observaciones, setObservaciones] = useState('');
    const [loading, setLoading] = useState(true);
    const [preguntas, setPreguntas] = useState([]);
    const [respuestas, setRespuestas] = useState({});
    const { user } = useAuth();
    const { showNotification } = useNotification();
    const estudianteId = user?.id;

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
            console.log('Respuesta del servidor:', response.data);
            
            if (Array.isArray(response.data)) {
                setTutorias(response.data);
            }
            else if (response.data && response.data.data) {
                setTutorias(response.data.data);
            }
            else if (response.data && response.data.success === false) {
                throw new Error(response.data.error || 'Error al cargar las tutorías');
            }
            else {
                setTutorias([]);
            }
        } catch (error) {
            console.error('Error al cargar tutorías:', error);
            console.error('Detalles del error:', error.response?.data);
            
            let errorMessage = 'Error al cargar las tutorías';
            
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            showNotification(errorMessage, 'error');
            setTutorias([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (tutoria) => {
        setSelectedTutoria(tutoria);
        setObservaciones(tutoria.observaciones || '');
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
                showNotification('Tutoría eliminada exitosamente', 'success');
                handleCloseDeleteDialog();
                await cargarTutorias();
            } else {
                throw new Error('Error al eliminar la tutoría');
            }
        } catch (error) {
            console.error('Error al eliminar tutoría:', error);
            
            if (error.response?.status === 200 || error.response?.status === 204) {
                showNotification('Tutoría eliminada exitosamente', 'success');
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

    const cargarPreguntas = async () => {
        try {
            const response = await api.get('/pregunta-encuesta');
            setPreguntas(response.data);
            const respuestasIniciales = {};
            response.data.forEach(pregunta => {
                respuestasIniciales[pregunta.id] = pregunta.tipo_pregunta === 'binaria' ? '' : 0;
            });
            setRespuestas(respuestasIniciales);
        } catch (error) {
            console.error('Error al cargar preguntas:', error);
            showNotification('Error al cargar las preguntas de la encuesta', 'error');
        }
    };

    const handleRespuestaChange = (preguntaId, valor) => {
        setRespuestas(prev => ({
            ...prev,
            [preguntaId]: valor
        }));
    };

    const handleEncuestaSubmit = async () => {
        const preguntasSinRespuesta = preguntas.filter(pregunta => {
            const respuesta = respuestas[pregunta.id];
            return pregunta.tipo_pregunta === 'binaria' ? !respuesta : respuesta === 0;
        });

        if (preguntasSinRespuesta.length > 0) {
            showNotification('Por favor, responda todas las preguntas', 'error');
            return;
        }

        setLoading(true);
        try {
            await api.post('/asistencia-tutoria', {
                tutoria_id: selectedTutoria.id,
                estudiante_id: estudianteId,
                observaciones: 'Asistencia registrada con encuesta de satisfacción'
            });

            const encuestaResponse = await api.post('/encuesta-satisfaccion', {
                tutoria_id: selectedTutoria.id
            });
            const encuesta = encuestaResponse.data;

            const respuestasArray = Object.entries(respuestas).map(([preguntaId, valor]) => ({
                encuesta_satisfaccion_id: encuesta.id,
                pregunta_encuesta_id: preguntaId,
                respuesta: valor
            }));

            await api.post('/respuesta-encuesta/batch', respuestasArray);
            
            showNotification('Encuesta y firma registradas exitosamente', 'success');
            setOpenEncuestaDialog(false);
            await cargarTutorias();
        } catch (error) {
            console.error('Error al enviar encuesta:', error);
            showNotification('Error al registrar la encuesta y firma', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFirmarTutoria = async (tutoriaId) => {
        try {
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

            setSelectedTutoria(tutoria);
            await cargarPreguntas();
            setOpenEncuestaDialog(true);
        } catch (error) {
            showNotification(error.message, 'error');
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
                <DialogTitle>Registrar Asistencia</DialogTitle>
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
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button 
                        onClick={handleEncuestaSubmit} 
                        variant="contained" 
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Confirmar Asistencia y Enviar Encuesta'}
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

            <Dialog 
                open={openEncuestaDialog} 
                onClose={() => setOpenEncuestaDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Encuesta de Satisfacción</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Por favor, responda las siguientes preguntas para confirmar su asistencia y ayudarnos a mejorar nuestro servicio.
                        </Alert>
                        {preguntas.map((pregunta) => (
                            <Box key={pregunta.id} sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    {pregunta.texto_pregunta}
                                </Typography>
                                {pregunta.tipo_pregunta === 'binaria' ? (
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            value={respuestas[pregunta.id]}
                                            onChange={(e) => handleRespuestaChange(pregunta.id, e.target.value)}
                                        >
                                            <FormControlLabel value="si" control={<Radio />} label="Sí" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Rating
                                            value={respuestas[pregunta.id]}
                                            onChange={(_, newValue) => handleRespuestaChange(pregunta.id, newValue)}
                                            max={5}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {respuestas[pregunta.id] === 0 ? 'Sin calificar' :
                                             respuestas[pregunta.id] === 1 ? 'Totalmente en desacuerdo' :
                                             respuestas[pregunta.id] === 2 ? 'En desacuerdo' :
                                             respuestas[pregunta.id] === 3 ? 'Neutral' :
                                             respuestas[pregunta.id] === 4 ? 'De acuerdo' :
                                             'Totalmente de acuerdo'}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEncuestaDialog(false)}>Cancelar</Button>
                    <Button 
                        onClick={handleEncuestaSubmit} 
                        variant="contained" 
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Confirmar Asistencia y Enviar Encuesta'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TutoriasEstudiante; 