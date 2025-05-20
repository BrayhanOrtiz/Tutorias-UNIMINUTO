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
    Button
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Download as DownloadIcon } from '@mui/icons-material';
import api from '../../services/api'; // Asegúrate de que la instancia 'api' está correctamente configurada

const GestionDocentes = () => {
    const [docentes, setDocentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarDocentes = async () => {
            try {
                setLoading(true);
                // Asumiendo que el endpoint para obtener docentes por rol es /usuarios/rol/2
                const response = await api.get('/usuarios/rol/2');
                if (response.data.success) {
                    setDocentes(response.data.data);
                } else {
                    setError(response.data.message || 'Error al cargar los docentes');
                }
            } catch (err) {
                console.error('Error al cargar docentes:', err);
                 // Mostrar un mensaje de error más amigable si es un error de red o del servidor
                setError(err.response?.data?.message || 'Error de conexión o servidor al cargar docentes.');
            } finally {
                setLoading(false);
            }
        };

        cargarDocentes();
    }, []); // El array vacío asegura que esto se ejecuta solo una vez al montar el componente

    // --- Funciones placeholder para acciones --- //

    const handleEdit = (docente) => {
        console.log('Editar docente:', docente);
        // Implementar lógica para editar (abrir modal/formulario)
    };

    const handleDelete = (docenteId) => {
        console.log('Eliminar docente ID:', docenteId);
        // Implementar lógica para eliminar (con doble confirmación)
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

            {/* Botón para Agregar Docente (placeholder) */}
            <Box sx={{ mb: 2 }}>
                <Button variant="contained" color="primary" onClick={() => console.log('Agregar docente')}>
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
                                        No se encontraron docentes.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default GestionDocentes; 