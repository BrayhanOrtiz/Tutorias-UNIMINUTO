import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, ButtonGroup, Button, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const chartData = [
  { name: 'Ene', encuestas: 5 },
  { name: 'Feb', encuestas: 8 },
  { name: 'Mar', encuestas: 12 },
  { name: 'Abr', encuestas: 18 },
];

const CARD_COLORS = ['#FFD600', '#0033A0', '#E2001A', '#2E7D32'];

const DashboardAdmin = () => {
  const { user } = useAuth();
  const [selectedRange, setSelectedRange] = useState('Hoy');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metricData, setMetricData] = useState([
    { label: 'Docentes', value: 0, icon: <SupervisorAccountIcon fontSize="large" color="primary" /> },
    { label: 'Reportes', value: 12, icon: <AssessmentIcon fontSize="large" color="primary" /> },
    { label: 'Preguntas', value: 0, icon: <AssignmentIcon fontSize="large" color="primary" /> },
    { label: 'Encuestas', value: 0, icon: <ListAltIcon fontSize="large" color="primary" /> },
  ]);

  const handleRangeChange = (range) => setSelectedRange(range);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('token');
        // Docentes
        const resDoc = await axios.get('/api/usuarios/rol/2', { headers: { Authorization: `Bearer ${token}` } });
        // Preguntas
        const resPreg = await axios.get('/api/pregunta-encuesta', { headers: { Authorization: `Bearer ${token}` } });
        // Encuestas
        const resEnc = await axios.get('/api/encuesta-satisfaccion', { headers: { Authorization: `Bearer ${token}` } });
        setMetricData([
          { label: 'Docentes', value: Array.isArray(resDoc.data.data) ? resDoc.data.data.length : 0, icon: <SupervisorAccountIcon fontSize="large" color="primary" /> },
          { label: 'Reportes', value: 12, icon: <AssessmentIcon fontSize="large" color="primary" /> },
          { label: 'Preguntas', value: Array.isArray(resPreg.data) ? resPreg.data.length : (resPreg.data.data?.length || 0), icon: <AssignmentIcon fontSize="large" color="primary" /> },
          { label: 'Encuestas', value: Array.isArray(resEnc.data) ? resEnc.data.length : (resEnc.data.data?.length || 0), icon: <ListAltIcon fontSize="large" color="primary" /> },
        ]);
      } catch (e) {
        setError('Error al cargar las métricas');
      }
      setLoading(false);
    };
    fetchMetrics();
  }, [user]);

  // Menú de navegación (se mantiene debajo del dashboard principal)
  const menuItems = [
    {
      title: 'Gestión de Docentes',
      description: 'Administra los docentes del sistema',
      icon: <SupervisorAccountIcon sx={{ fontSize: 40 }} />, 
      path: '/admin/gestion-docentes',
      color: '#1976d2'
    },
    {
      title: 'Reportes de Tutorías',
      description: 'Visualiza reportes y estadísticas de tutorías',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />, 
      path: '/admin/reportes-tutorias',
      color: '#2e7d32'
    },
    {
      title: 'Gestión de Preguntas',
      description: 'Administra las preguntas de las encuestas',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />, 
      path: '/admin/gestion-encuestas',
      color: '#ed6c02'
    },
    {
      title: 'Listado de Encuestas',
      description: 'Visualiza las encuestas realizadas',
      icon: <ListAltIcon sx={{ fontSize: 40 }} />, 
      path: '/admin/listado-encuestas',
      color: '#9c27b0'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
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
      )}
      {/* Dashboard de Power BI */}
      <Grid item xs={12} sx={{ mb: 4 }}>
        <Card>
          <CardContent>
            <iframe 
              title="Dashboard Tutorias UNIM" 
              width="100%" 
              height="400" 
              src="https://app.powerbi.com/reportEmbed?reportId=e3ec05e5-beef-4f55-803b-3c887c405db6&autoAuth=true&ctid=b1ba85eb-a253-4467-9ee8-d4f8ed4df300" 
              frameBorder="0" 
              allowFullScreen={true}
            />
          </CardContent>
        </Card>
      </Grid>
      {/* Menú de navegación */}
      <Grid container spacing={3}>
        {menuItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                minHeight: 180,
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                backgroundColor: CARD_COLORS[index % CARD_COLORS.length],
                color: '#fff',
                boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0 8px 24px 0 rgba(0,0,0,0.18)',
                  cursor: 'pointer',
                  filter: 'brightness(1.06)'
                }
              }}
              onClick={() => navigate(item.path)}
            >
              <CardContent sx={{ 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                color: CARD_COLORS[index % CARD_COLORS.length] === '#FFD600' ? '#333' : '#fff',
                p: 2
              }}>
                <Box sx={{ color: CARD_COLORS[index % CARD_COLORS.length] === '#FFD600' ? '#333' : '#fff', mb: 1, fontSize: 38 }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ color: CARD_COLORS[index % CARD_COLORS.length] === '#FFD600' ? '#333' : '#fff', fontWeight: 700, fontSize: 18 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: CARD_COLORS[index % CARD_COLORS.length] === '#FFD600' ? '#333' : '#fff', opacity: 0.95, fontSize: 14 }}>
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardAdmin; 