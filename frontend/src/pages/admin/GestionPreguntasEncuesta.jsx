import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Grid,
    Divider
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';

// Configurar axios para usar la URL base
axios.defaults.baseURL = 'http://localhost:3000';

const GestionPreguntasEncuesta = () => {
    const [preguntas, setPreguntas] = useState([]);
    const [respuestas, setRespuestas] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openRespuestasDialog, setOpenRespuestasDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [preguntaToDelete, setPreguntaToDelete] = useState(null);
    const [formData, setFormData] = useState({
        id: null,
        texto_pregunta: '',
        tipo_pregunta: 'binaria',
        opciones_respuesta: []
    });
    const [nuevaOpcion, setNuevaOpcion] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    const cargarPreguntas = async () => {
        try {
            const response = await axios.get('/api/pregunta-encuesta');
            setPreguntas(response.data);
        } catch (error) {
            console.error('Error al cargar preguntas:', error);
            enqueueSnackbar('Error al cargar las preguntas', { variant: 'error' });
        }
    };

    const cargarRespuestas = async () => {
        try {
            const response = await axios.get('/api/respuesta-encuesta');
            setRespuestas(response.data);
        } catch (error) {
            console.error('Error al cargar respuestas:', error);
            enqueueSnackbar('Error al cargar las respuestas', { variant: 'error' });
        }
    };

    useEffect(() => {
        cargarPreguntas();
        cargarRespuestas();
    }, []);

    const handleOpenDialog = (pregunta = null) => {
        if (pregunta) {
            setFormData({
                id: pregunta.id,
                texto_pregunta: pregunta.texto_pregunta,
                tipo_pregunta: pregunta.tipo_pregunta,
                opciones_respuesta: pregunta.opciones_respuesta || []
            });
        } else {
            setFormData({
                id: null,
                texto_pregunta: '',
                tipo_pregunta: 'binaria',
                opciones_respuesta: []
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            id: null,
            texto_pregunta: '',
            tipo_pregunta: 'binaria',
            opciones_respuesta: []
        });
        setNuevaOpcion('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddOpcion = () => {
        if (nuevaOpcion.trim()) {
            setFormData(prev => ({
                ...prev,
                opciones_respuesta: [...prev.opciones_respuesta, nuevaOpcion.trim()]
            }));
            setNuevaOpcion('');
        }
    };

    const handleRemoveOpcion = (index) => {
        setFormData(prev => ({
            ...prev,
            opciones_respuesta: prev.opciones_respuesta.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.tipo_pregunta === 'likert' && formData.opciones_respuesta.length === 0) {
                enqueueSnackbar('Las preguntas tipo Likert deben tener al menos una opción de respuesta', { variant: 'error' });
                return;
            }

            if (formData.id) {
                await axios.put(`/api/pregunta-encuesta/${formData.id}`, formData);
                enqueueSnackbar('Pregunta actualizada exitosamente', { variant: 'success' });
            } else {
                await axios.post('/api/pregunta-encuesta', formData);
                enqueueSnackbar('Pregunta creada exitosamente', { variant: 'success' });
            }
            handleCloseDialog();
            cargarPreguntas();
        } catch (error) {
            console.error('Error al guardar pregunta:', error);
            enqueueSnackbar(error.response?.data?.error || 'Error al guardar la pregunta', { variant: 'error' });
        }
    };

    const handleDeleteClick = (pregunta) => {
        setPreguntaToDelete(pregunta);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`/api/pregunta-encuesta/${preguntaToDelete.id}`);
            enqueueSnackbar('Pregunta eliminada exitosamente', { variant: 'success' });
            setOpenDeleteDialog(false);
            cargarPreguntas();
        } catch (error) {
            console.error('Error al eliminar pregunta:', error);
            enqueueSnackbar('Error al eliminar la pregunta', { variant: 'error' });
        }
    };

    const handleOpenRespuestasDialog = (pregunta) => {
        setFormData({
            id: pregunta.id,
            texto_pregunta: pregunta.texto_pregunta,
            tipo_pregunta: pregunta.tipo_pregunta,
            opciones_respuesta: pregunta.opciones_respuesta || []
        });
        setOpenRespuestasDialog(true);
    };

    const handleCloseRespuestasDialog = () => {
        setOpenRespuestasDialog(false);
        setFormData({
            id: null,
            texto_pregunta: '',
            tipo_pregunta: 'binaria',
            opciones_respuesta: []
        });
        setNuevaOpcion('');
    };

    const handleSubmitRespuestas = async (e) => {
        e.preventDefault();
        try {
            if (formData.tipo_pregunta === 'likert' && formData.opciones_respuesta.length === 0) {
                enqueueSnackbar('Las preguntas tipo Likert deben tener al menos una opción de respuesta', { variant: 'error' });
                return;
            }

            await axios.put(`/api/pregunta-encuesta/${formData.id}`, formData);
            enqueueSnackbar('Respuestas actualizadas exitosamente', { variant: 'success' });
            handleCloseRespuestasDialog();
            cargarPreguntas();
        } catch (error) {
            console.error('Error al actualizar respuestas:', error);
            enqueueSnackbar(error.response?.data?.error || 'Error al actualizar las respuestas', { variant: 'error' });
        }
    };

  return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
                Gestión de Preguntas y Respuestas
            </Typography>

            <Grid container spacing={3}>
                {/* Tabla de Preguntas */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Preguntas</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenDialog()}
                            startIcon={<AddIcon />}
                        >
                            Nueva Pregunta
                        </Button>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Pregunta</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {preguntas.map((pregunta) => (
                                    <TableRow key={pregunta.id}>
                                        <TableCell>{pregunta.id}</TableCell>
                                        <TableCell>{pregunta.texto_pregunta}</TableCell>
                                        <TableCell>
                                            {pregunta.tipo_pregunta === 'binaria' ? 'Sí/No' : 'Likert'}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenDialog(pregunta)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteClick(pregunta)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Tabla de Respuestas */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Respuestas Posibles</Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleOpenRespuestasDialog(preguntas[0])}
                            startIcon={<EditIcon />}
                        >
                            Modificar Respuestas
                        </Button>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID Pregunta</TableCell>
                                    <TableCell>Pregunta</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Respuestas Posibles</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {preguntas.map((pregunta) => (
                                    <TableRow key={pregunta.id}>
                                        <TableCell>{pregunta.id}</TableCell>
                                        <TableCell>{pregunta.texto_pregunta}</TableCell>
                                        <TableCell>
                                            {pregunta.tipo_pregunta === 'binaria' ? 'Sí/No' : 'Likert'}
                                        </TableCell>
                                        <TableCell>
                                            {pregunta.tipo_pregunta === 'binaria' ? (
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Chip label="Sí" color="primary" />
                                                    <Chip label="No" color="secondary" />
                                                </Box>
                                            ) : (
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                    <Chip 
                                                        label="1 - Totalmente en desacuerdo" 
                                                        color="error" 
                                                        sx={{ width: 'fit-content' }}
                                                    />
                                                    <Chip 
                                                        label="2 - En desacuerdo" 
                                                        color="warning" 
                                                        sx={{ width: 'fit-content' }}
                                                    />
                                                    <Chip 
                                                        label="3 - Neutral" 
                                                        color="info" 
                                                        sx={{ width: 'fit-content' }}
                                                    />
                                                    <Chip 
                                                        label="4 - De acuerdo" 
                                                        color="success" 
                                                        sx={{ width: 'fit-content' }}
                                                    />
                                                    <Chip 
                                                        label="5 - Totalmente de acuerdo" 
                                                        color="primary" 
                                                        sx={{ width: 'fit-content' }}
                                                    />
                                                </Box>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

            {/* Diálogo para crear/editar pregunta */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {formData.id ? 'Editar Pregunta' : 'Nueva Pregunta'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Texto de la Pregunta"
                                    name="texto_pregunta"
                                    value={formData.texto_pregunta}
                                    onChange={handleInputChange}
                                    required
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Tipo de Pregunta</InputLabel>
                                    <Select
                                        name="tipo_pregunta"
                                        value={formData.tipo_pregunta}
                                        onChange={handleInputChange}
                                        label="Tipo de Pregunta"
                                    >
                                        <MenuItem value="binaria">Sí/No</MenuItem>
                                        <MenuItem value="likert">Likert</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {formData.tipo_pregunta === 'likert' && (
                                <>
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="subtitle1" gutterBottom>
                                            Opciones de Respuesta
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                            <TextField
                                                fullWidth
                                                label="Nueva Opción"
                                                value={nuevaOpcion}
                                                onChange={(e) => setNuevaOpcion(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddOpcion();
                                                    }
                                                }}
                                            />
                                            <Button
                                                variant="contained"
                                                onClick={handleAddOpcion}
                                                disabled={!nuevaOpcion.trim()}
                                                startIcon={<AddIcon />}
                                            >
                                                Agregar
                                            </Button>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {formData.opciones_respuesta.map((opcion, index) => (
                                                <Chip
                                                    key={index}
                                                    label={opcion}
                                                    onDelete={() => handleRemoveOpcion(index)}
                                                />
                                            ))}
                                        </Box>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {formData.id ? 'Actualizar' : 'Crear'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Diálogo para modificar respuestas */}
            <Dialog open={openRespuestasDialog} onClose={handleCloseRespuestasDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    Modificar Respuestas - {formData.texto_pregunta}
                </DialogTitle>
                <form onSubmit={handleSubmitRespuestas}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Opciones de Respuesta
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Nueva Opción"
                                        value={nuevaOpcion}
                                        onChange={(e) => setNuevaOpcion(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddOpcion();
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleAddOpcion}
                                        disabled={!nuevaOpcion.trim()}
                                        startIcon={<AddIcon />}
                                    >
                                        Agregar
                                    </Button>
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {formData.opciones_respuesta.map((opcion, index) => (
                                        <Chip
                                            key={index}
                                            label={opcion}
                                            onDelete={() => handleRemoveOpcion(index)}
                                        />
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseRespuestasDialog}>Cancelar</Button>
                        <Button type="submit" variant="contained" color="primary">
                            Guardar Cambios
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Diálogo de confirmación para eliminar */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Está seguro que desea eliminar la pregunta "{preguntaToDelete?.texto_pregunta}"?
      </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
    </Box>
  );
};

export default GestionPreguntasEncuesta; 