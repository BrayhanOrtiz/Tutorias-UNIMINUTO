import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const DashboardAdmin = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gestión de Usuarios
              </Typography>
              {/* Aquí irá el componente de gestión de usuarios */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gestión de Carreras
              </Typography>
              {/* Aquí irá el componente de gestión de carreras */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reportes
              </Typography>
              {/* Aquí irá el componente de reportes */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estadísticas Generales
              </Typography>
              {/* Aquí irá el componente de estadísticas generales */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardAdmin; 