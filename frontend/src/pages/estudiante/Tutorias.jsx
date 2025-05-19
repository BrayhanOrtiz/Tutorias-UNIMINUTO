import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Snackbar
} from '@mui/material';
import axios from 'axios';

const Tutorias = () => {
  const { user } = useAuth();
  const [tutorias, setTutorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchTutorias = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/tutorias/estudiante/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTutorias(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setError('Error al cargar las tutorías');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTutorias();
    }
  }, [user]);

  const handleFirmarAsistencia = async (tutoriaId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/asistencia-tutoria', {
        tutoria_id: tutoriaId,
        estudiante_id: user.id,
        observaciones: 'Asistencia registrada por el estudiante'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Actualizar la lista de tutorías
      const res = await axios.get(`/api/tutorias/estudiante/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTutorias(Array.isArray(res.data) ? res.data : []);

      setSnackbar({
        open: true,
        message: 'Asistencia registrada exitosamente',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Error al registrar la asistencia',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getEstadoColor = (firmada) => {
    return firmada ? 'success' : 'warning';
  };

  const getEstadoText = (firmada) => {
    return firmada ? 'Asistencia registrada' : 'Pendiente de asistencia';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mis Tutorías
      </Typography>
      
      {tutorias.length === 0 ? (
        <Alert severity="info">
          No tienes tutorías agendadas actualmente
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {tutorias.map((tutoria) => (
            <Grid item xs={12} md={6} lg={4} key={tutoria.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {tutoria.nombre_tema}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Docente: {tutoria.nombre_docente}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Fecha y Hora: {new Date(tutoria.fecha_hora_agendada).toLocaleString()}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={getEstadoText(tutoria.firmada_estudiante)}
                      color={getEstadoColor(tutoria.firmada_estudiante)}
                      size="small"
                    />
                    {!tutoria.firmada_estudiante && tutoria.firma_docente_habilitada && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleFirmarAsistencia(tutoria.id)}
                      >
                        Firmar Asistencia
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Tutorias; 