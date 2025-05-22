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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

const getLikertText = (value) => {
  const likertMap = {
    '1': 'Muy Insatisfecho',
    '2': 'Insatisfecho',
    '3': 'Neutral',
    '4': 'Satisfecho',
    '5': 'Muy Satisfecho'
  };
  return likertMap[value] || value;
};

const ListadoEncuestas = () => {
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEncuesta, setSelectedEncuesta] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchEncuestas();
  }, []);

  const fetchEncuestas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/encuesta-satisfaccion');
      setEncuestas(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las encuestas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (encuestaId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/respuesta-encuesta/encuesta/${encuestaId}`);
      setSelectedEncuesta({
        ...encuestas.find(e => e.id === encuestaId),
        respuestas: response.data
      });
      setOpenDialog(true);
    } catch (err) {
      console.error('Error al cargar detalles:', err);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEncuesta(null);
  };

  const renderRespuesta = (respuesta) => {
    // Si la respuesta es un número entre 1 y 5, asumimos que es una respuesta Likert
    if (/^[1-5]$/.test(respuesta)) {
      return `${respuesta} - ${getLikertText(respuesta)}`;
    }
    return respuesta;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Encuestas de Satisfacción Generadas
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estudiante</TableCell>
              <TableCell>Docente</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {encuestas.map((encuesta) => (
              <TableRow key={encuesta.id}>
                <TableCell>{encuesta.id}</TableCell>
                <TableCell>{new Date(encuesta.fecha_respuesta).toLocaleDateString()}</TableCell>
                <TableCell>{encuesta.nombre_estudiante} {encuesta.apellido_estudiante}</TableCell>
                <TableCell>{encuesta.nombre_docente} {encuesta.apellido_docente}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewDetails(encuesta.id)}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Detalles de la Encuesta</DialogTitle>
        <DialogContent>
          {selectedEncuesta && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Fecha: {new Date(selectedEncuesta.fecha_respuesta).toLocaleString()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Estudiante: {selectedEncuesta.nombre_estudiante} {selectedEncuesta.apellido_estudiante}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Docente: {selectedEncuesta.nombre_docente} {selectedEncuesta.apellido_docente}
              </Typography>
              
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Respuestas:
              </Typography>
              {selectedEncuesta.respuestas?.map((respuesta) => (
                <Box key={respuesta.id} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">
                    {respuesta.texto_pregunta}
                  </Typography>
                  <Typography>
                    Respuesta: {renderRespuesta(respuesta.respuesta)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListadoEncuestas; 