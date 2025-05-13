import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const DashboardEstudiante = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Estudiante
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mis Tutorías
              </Typography>
              {/* Aquí irá el componente de tutorías del estudiante */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Próximas Sesiones
              </Typography>
              {/* Aquí irá el componente de próximas sesiones */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardEstudiante; 