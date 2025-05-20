import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import PowerBIDashboard from './PowerBIDashboard';
import GestionDocentes from './GestionDocentes';
import ReportesTutorias from './ReportesTutorias';
import GestionPreguntasEncuesta from './GestionPreguntasEncuesta';
import ListadoEncuestas from './ListadoEncuestas';

const DashboardAdmin = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>
      <Grid container spacing={3}>
        {/* Sección 1: Dashboard de Power BI */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <PowerBIDashboard />
            </CardContent>
          </Card>
        </Grid>

        {/* Sección 2: Gestión de Docentes (CRUD) */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <GestionDocentes />
            </CardContent>
          </Card>
        </Grid>

        {/* Sección 3: Reportes de Tutorías */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <ReportesTutorias />
            </CardContent>
          </Card>
        </Grid>

        {/* Sección 4: Gestión de Preguntas de Encuesta */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <GestionPreguntasEncuesta />
            </CardContent>
          </Card>
        </Grid>

        {/* Sección 5: Listado de Encuestas de Satisfacción */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <ListadoEncuestas />
            </CardContent>
          </Card>
        </Grid>

        {/* Conservamos las secciones existentes si aún son relevantes */}
        {/* Puedes decidir si estas son necesarias o si las nuevas secciones las reemplazan */}
        {/*
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gestión de Usuarios
              </Typography>
            </CardContent>
          </Card>
        </Grid>
         <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gestión de Carreras
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estadísticas Generales
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        */}

      </Grid>
    </Box>
  );
};

export default DashboardAdmin; 