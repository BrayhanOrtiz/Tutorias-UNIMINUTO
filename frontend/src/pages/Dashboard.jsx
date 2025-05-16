import { Grid, Card, CardContent, Typography } from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon }) => (
  <Card>
    <CardContent>
      <Grid container spacing={2} alignItems="center">
        <Grid item>{icon}</Grid>
        <Grid item xs>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" component="div">
            {value}
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  // Aquí se agregarán las llamadas a la API para obtener las estadísticas
  const stats = {
    tutoriasActivas: 0,
    estudiantesActivos: 0,
    encuestasPendientes: 0,
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Tutorías Activas"
            value={stats.tutoriasActivas}
            icon={<AssignmentIcon color="primary" fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Estudiantes Activos"
            value={stats.estudiantesActivos}
            icon={<PeopleIcon color="primary" fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Encuestas Pendientes"
            value={stats.encuestasPendientes}
            icon={<AssessmentIcon color="primary" fontSize="large" />}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard; 