import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PowerBIDashboard from './PowerBIDashboard';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';

const DashboardAdmin = () => {
  const navigate = useNavigate();

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

      {/* Dashboard de Power BI */}
      <Grid item xs={12} sx={{ mb: 4 }}>
        <Card>
          <CardContent>
            <PowerBIDashboard />
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
              onClick={() => navigate(item.path)}
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