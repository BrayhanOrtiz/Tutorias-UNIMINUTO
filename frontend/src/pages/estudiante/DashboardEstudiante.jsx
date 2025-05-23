import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Paper, ButtonGroup, Divider } from '@mui/material';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { useNotification } from '../../components/NotificationSystem';
import { useAuth } from '../../context/AuthContext';

const chartData = [
  { name: 'Ene', tutorias: 2 },
  { name: 'Feb', tutorias: 3 },
  { name: 'Mar', tutorias: 5 },
  { name: 'Abr', tutorias: 8 },
];

// Colores para la torta
const PIE_COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#00bcd4', '#ff9800', '#e91e63', '#607d8b'];

const DashboardEstudiante = () => {
  const [estudiante, setEstudiante] = useState(null);
  const [docentes, setDocentes] = useState([]);
  const [tutorias, setTutorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState(null);
  const [temas, setTemas] = useState([]);
  const [form, setForm] = useState({
    fecha_hora_agendada: '',
    tema_id: ''
  });
  const [horariosDocentes, setHorariosDocentes] = useState({});
  const [selectedRange, setSelectedRange] = useState('Hoy');
  const { showNotification } = useNotification();
  const { user } = useAuth();

  // Tarjetas de resumen
  const metricData = useMemo(() => {
    const totalTutorias = tutorias.length;
    const docentesUnicos = new Set(tutorias.map(t => t.docente_id)).size;
    return [
      { label: 'Tutorías', value: totalTutorias, icon: <SchoolIcon fontSize="large" color="primary" /> },
      { label: 'Docentes', value: docentesUnicos, icon: <PeopleIcon fontSize="large" color="primary" /> },
      { label: 'Tareas', value: 3, icon: <AssignmentIcon fontSize="large" color="primary" /> },
      { label: 'Encuestas', value: 2, icon: <ListAltIcon fontSize="large" color="primary" /> },
    ];
  }, [tutorias]);

  // Próximas tutorías (las más cercanas en el futuro)
  const proximasTutorias = useMemo(() => {
    const ahora = new Date();
    return tutorias
      .filter(t => new Date(t.fecha_hora_agendada) > ahora)
      .sort((a, b) => new Date(a.fecha_hora_agendada) - new Date(b.fecha_hora_agendada))
      .slice(0, 3);
  }, [tutorias]);

  // Gráfica 1: Estado de las tutorías
  const estadosTutorias = useMemo(() => {
    const estados = {
      'Pendiente de asistencia': 0,
      'Asistencia registrada': 0,
      'Cancelada': 0
    };
    tutorias.forEach(t => {
      if (t.estado === 'cancelada') {
        estados['Cancelada']++;
      } else if (t.firmada_estudiante) {
        estados['Asistencia registrada']++;
      } else {
        estados['Pendiente de asistencia']++;
      }
    });
    return Object.entries(estados).map(([name, value]) => ({ name, value }));
  }, [tutorias]);

  // Gráfica 2: Docentes con los que más ha tenido tutorías
  const tutoriasPorDocente = useMemo(() => {
    const conteo = {};
    tutorias.forEach(t => {
      if (t.nombre_docente) {
        conteo[t.nombre_docente] = (conteo[t.nombre_docente] || 0) + 1;
      }
    });
    return Object.entries(conteo)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 docentes
  }, [tutorias]);

  useEffect(() => {
    if (!user) return;
    setEstudiante(null);
    setDocentes([]);
    setTutorias([]);
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        // Obtener datos del estudiante actual
        const token = localStorage.getItem('token');
        const resEst = await axios.get('/api/usuarios/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEstudiante(resEst.data.data);
        // Obtener docentes
        const resDoc = await axios.get('/api/usuarios/rol/2', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDocentes(Array.isArray(resDoc.data.data) ? resDoc.data.data : []);
        // Obtener tutorías del estudiante
        if (resEst.data.data) {
          const resTut = await axios.get(`/api/tutorias/estudiante/${resEst.data.data.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setTutorias(Array.isArray(resTut.data) ? resTut.data : []);
        }
      } catch (e) {
        setError('Error al cargar la información');
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // Nuevo: Cargar horarios individuales por docente
  useEffect(() => {
    if (!docentes.length) return;
    const token = localStorage.getItem('token');
    const fetchHorariosPorDocente = async (docenteId) => {
      try {
        const res = await axios.get(`/api/horarios/usuario/${docenteId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return res.data.data || [];
      } catch {
        return [];
      }
    };
    const cargarHorarios = async () => {
      const nuevosHorarios = {};
      await Promise.all(docentes.map(async (docente) => {
        const docenteId = Number(docente.id);
        nuevosHorarios[docenteId] = await fetchHorariosPorDocente(docenteId);
      }));
      setHorariosDocentes(nuevosHorarios);
    };
    cargarHorarios();
  }, [docentes]);

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
      
      // Obtener la fecha y hora seleccionada
      const fechaSeleccionada = new Date(form.fecha_hora_agendada);
      
      // Crear una fecha en UTC manteniendo la hora local
      const fechaHoraLocal = new Date(Date.UTC(
        fechaSeleccionada.getFullYear(),
        fechaSeleccionada.getMonth(),
        fechaSeleccionada.getDate(),
        fechaSeleccionada.getHours(),
        fechaSeleccionada.getMinutes()
      ));
      
      console.log('Hora seleccionada:', fechaSeleccionada.toLocaleString());
      console.log('Hora a enviar:', fechaHoraLocal.toISOString());
      
      await axios.post('/api/tutorias', {
        estudiante_id: estudiante.id,
        docente_id: selectedDocente.id,
        fecha_hora_agendada: fechaHoraLocal.toISOString(),
        tema_id: form.tema_id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('¡Tutoría agendada con éxito!', 'success');
      handleCloseForm();
    } catch (e) {
      console.error('Error al agendar la tutoría:', e);
      showNotification('Error al agendar la tutoría', 'error');
    }
  };

  const handleRangeChange = (range) => setSelectedRange(range);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Estudiante
      </Typography>
      {/* Tarjetas de resumen */}
      <Grid container spacing={2} mb={2}>
        {metricData.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.label}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              {metric.icon}
              <Box>
                <Typography variant="subtitle2" color="text.secondary">{metric.label}</Typography>
                <Typography variant="h5" fontWeight="bold">{metric.value}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {/* Solo las dos gráficas, ocupando toda la fila en desktop */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Estado de tus tutorías
            </Typography>
            {tutorias.length === 0 ? (
              <Typography variant="body2" color="text.secondary">Aún no tienes tutorías agendadas para mostrar estados.</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={estadosTutorias} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1976d2">
                    <LabelList dataKey="value" position="right" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Docentes con los que más has tenido tutorías
            </Typography>
            {tutoriasPorDocente.length === 0 ? (
              <Typography variant="body2" color="text.secondary">Aún no tienes tutorías agendadas para mostrar docentes.</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={tutoriasPorDocente} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2e7d32">
                    <LabelList dataKey="value" position="right" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
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
            {Array.isArray(docentes) && docentes.map((docente) => {
              const docenteId = Number(docente.id);
              return (
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
                        <Typography variant="subtitle2">Horarios:</Typography>
                        {(horariosDocentes[docenteId] || []).map((h, i) => (
                          <Typography key={i} variant="body2">
                            {h.dia_semana} {h.hora_inicio} - {h.hora_fin} | Salón: {h.salon}
                          </Typography>
                        ))}
                      </Box>
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
              );
            })}
          </Grid>

          {/* Sección de Tutorías Agendadas */}
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            Mis Tutorías Agendadas
          </Typography>
          <Grid container spacing={3}>
            {Array.isArray(tutorias) && tutorias.map((tutoria) => (
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
                      Fecha y Hora: {new Date(tutoria.fecha_hora_agendada).toLocaleString('es-ES', {
                        timeZone: 'America/Bogota',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Estado: {tutoria.firmada_estudiante ? 'Asistencia registrada' : 'Pendiente de asistencia'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {Array.isArray(tutorias) && tutorias.length === 0 && (
              <Grid item xs={12}>
                <Alert severity="info">
                  No tienes tutorías agendadas actualmente
                </Alert>
              </Grid>
            )}
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