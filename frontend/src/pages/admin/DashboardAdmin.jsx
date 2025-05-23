import { useState } from 'react';
import { Box, Typography, Grid, Paper, ButtonGroup, Button, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';

const metricData = [
  { label: 'Docentes', value: 25, icon: <SupervisorAccountIcon fontSize="large" color="primary" /> },
  { label: 'Reportes', value: 12, icon: <AssessmentIcon fontSize="large" color="primary" /> },
  { label: 'Preguntas', value: 40, icon: <AssignmentIcon fontSize="large" color="primary" /> },
  { label: 'Encuestas', value: 18, icon: <ListAltIcon fontSize="large" color="primary" /> },
];

const chartData = [
  { name: 'Ene', encuestas: 5 },
  { name: 'Feb', encuestas: 8 },
  { name: 'Mar', encuestas: 12 },
  { name: 'Abr', encuestas: 18 },
];

const DashboardAdmin = () => {
  const [selectedRange, setSelectedRange] = useState('Hoy');

  const handleRangeChange = (range) => setSelectedRange(range);

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

      {/* Tarjetas de métricas */}
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

      {/* Filtros de tiempo */}
      <Box mb={2} display="flex" justifyContent="flex-end">
        <ButtonGroup variant="outlined" color="primary">
          {['Hoy', '7 Días', '15 Días', '30 Días', '90 Días'].map((range) => (
            <Button
              key={range}
              variant={selectedRange === range ? 'contained' : 'outlined'}
              onClick={() => handleRangeChange(range)}
            >
              {range}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Felicitación y gráfico */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              ¡Bienvenido Administrador! 🎉
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>
              Aquí puedes ver un resumen de la actividad reciente del sistema.
            </Typography>
            <Box display="flex" gap={4}>
              <Box>
                <Typography variant="h4" fontWeight="bold">$4800</Typography>
                <Typography variant="caption" color="text.secondary">Ingresos este año</Typography>
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="error">$2300</Typography>
                <Typography variant="caption" color="text.secondary">Ingresos año pasado</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Encuestas Realizadas
            </Typography>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="encuestas" fill="#1976d2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

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
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  cursor: 'pointer'
                }
              }}
              onClick={() => window.location.href = item.path}
            >
              <CardContent sx={{ 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <Box sx={{ color: item.color, mb: 2 }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
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