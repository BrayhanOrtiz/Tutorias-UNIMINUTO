import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import axios from 'axios';

const DashboardEstudiante = () => {
  const [estudiante, setEstudiante] = useState(null);
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState(null);
  const [temas, setTemas] = useState([]);
  const [form, setForm] = useState({
    fecha_hora_agendada: '',
    tema_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Obtener datos del estudiante actual
        const token = localStorage.getItem('token');
        const resEst = await axios.get('/api/usuarios/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Respuesta estudiante:', resEst.data);
        setEstudiante(resEst.data.data);

        // Obtener docentes
        const resDoc = await axios.get('/api/usuarios/rol/2');
        console.log('Respuesta docentes:', resDoc.data);
        setDocentes(Array.isArray(resDoc.data.data) ? resDoc.data.data : []);
        console.log('Docentes:', resDoc.data.data);
      } catch (e) {
        setError('Error al cargar la información');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Cargar temas al abrir el formulario
  const cargarTemas = async () => {
    try {
      const res = await axios.get('/api/temas');
      setTemas(res.data.data || []);
    } catch {
      setTemas([]);
    }
  };

  const handleOpenForm = (docente) => {
    setSelectedDocente(docente);
    setOpenForm(true);
    cargarTemas();
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setForm({ fecha_hora_agendada: '', tema_id: '' });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/tutorias', {
        estudiante_id: estudiante.id,
        docente_id: selectedDocente.id,
        fecha_hora_agendada: form.fecha_hora_agendada,
        tema_id: form.tema_id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('¡Tutoría agendada con éxito!');
      handleCloseForm();
    } catch (e) {
      alert('Error al agendar la tutoría');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Estudiante
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          {estudiante && (
            <Typography variant="h5" sx={{ mb: 4 }}>
              Bienvenido, {estudiante.nombre} {estudiante.apellido}
            </Typography>
          )}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Docentes disponibles
          </Typography>
          <Grid container spacing={3}>
            {Array.isArray(docentes) && docentes.map((docente) => (
              <Grid item xs={12} md={6} lg={4} key={docente.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      {docente.nombre} {docente.apellido}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Experticia: {docente.experticia || 'No especificada'}
                    </Typography>
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenForm(docente)}
                      >
                        Agendar tutoría
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Modal de formulario */}
          <Dialog open={openForm} onClose={handleCloseForm}>
            <DialogTitle>Agendar Tutoría</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Fecha y hora"
                type="datetime-local"
                name="fecha_hora_agendada"
                fullWidth
                value={form.fecha_hora_agendada}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                label="Tema"
                name="tema_id"
                select
                fullWidth
                value={form.tema_id}
                onChange={handleFormChange}
              >
                {temas.map((tema) => (
                  <MenuItem key={tema.id} value={tema.id}>
                    {tema.nombre_tema}
                  </MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseForm}>Cancelar</Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                Agendar
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default DashboardEstudiante; 