import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const DashboardDocente = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Docente
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mis Horarios
              </Typography>
              {/* Aquí irá el componente de horarios del docente */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Próximas Tutorías
              </Typography>
              {/* Aquí irá el componente de próximas tutorías */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estadísticas
              </Typography>
              {/* Aquí irá el componente de estadísticas */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardDocente; 