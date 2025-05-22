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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import api from '../../services/api';

const GestionPreguntasEncuesta = () => {
    const [preguntas, setPreguntas] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedPregunta, setSelectedPregunta] = useState(null);
    const [preguntaToDelete, setPreguntaToDelete] = useState(null);
    const [formData, setFormData] = useState({
        texto_pregunta: ''
    });
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const cargarPreguntas = async () => {
        try {
            setLoading(true);
            const response = await api.get('/pregunta-encuesta');
            setPreguntas(response.data);
        } catch (error) {
            console.error('Error al cargar preguntas:', error);
            showSnackbar('Error al cargar las preguntas', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPreguntas();
    }, []);

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

    const handleOpenDialog = (pregunta = null) => {
        if (pregunta) {
            setSelectedPregunta(pregunta);
            setFormData({ texto_pregunta: pregunta.texto_pregunta });
        } else {
            setSelectedPregunta(null);
            setFormData({ texto_pregunta: '' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPregunta(null);
        setFormData({ texto_pregunta: '' });
    };

    const handleOpenDeleteDialog = (pregunta) => {
        setPreguntaToDelete(pregunta);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setPreguntaToDelete(null);
    };

    const handleSubmit = async () => {
        try {
            if (!formData.texto_pregunta.trim()) {
                showSnackbar('El texto de la pregunta es requerido', 'error');
                return;
            }

            if (selectedPregunta) {
                await api.put(`/pregunta-encuesta/${selectedPregunta.id}`, formData);
                showSnackbar('Pregunta actualizada exitosamente');
            } else {
                await api.post('/pregunta-encuesta', formData);
                showSnackbar('Pregunta creada exitosamente');
            }

            handleCloseDialog();
            cargarPreguntas();
        } catch (error) {
            console.error('Error al guardar pregunta:', error);
            showSnackbar('Error al guardar la pregunta', 'error');
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/pregunta-encuesta/${preguntaToDelete.id}`);
            showSnackbar('Pregunta eliminada exitosamente');
            handleCloseDeleteDialog();
            cargarPreguntas();
        } catch (error) {
            console.error('Error al eliminar pregunta:', error);
            showSnackbar('Error al eliminar la pregunta', 'error');
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Gestión de Preguntas de Encuesta
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
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
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {preguntas.map((pregunta) => (
                            <TableRow key={pregunta.id}>
                                <TableCell>{pregunta.id}</TableCell>
                                <TableCell>{pregunta.texto_pregunta}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenDialog(pregunta)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleOpenDeleteDialog(pregunta)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Diálogo para crear/editar pregunta */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedPregunta ? 'Editar Pregunta' : 'Nueva Pregunta'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Texto de la Pregunta"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        value={formData.texto_pregunta}
                        onChange={(e) => setFormData({ ...formData, texto_pregunta: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {selectedPregunta ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de confirmación para eliminar */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Está seguro que desea eliminar esta pregunta? Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar para notificaciones */}
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

export default GestionPreguntasEncuesta; 