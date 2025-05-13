import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';

const Tareas = () => {
  // Estado de ejemplo para las tareas
  const [tareas] = useState([
    {
      id: 1,
      titulo: 'Análisis de caso práctico',
      descripcion: 'Realizar un análisis detallado del caso de estudio proporcionado',
      fecha_entrega: '2024-05-20',
      estado: 'pendiente',
      tutor: 'Dr. Juan Pérez',
    },
    {
      id: 2,
      titulo: 'Investigación bibliográfica',
      descripcion: 'Recopilar y analizar 5 artículos científicos sobre el tema',
      fecha_entrega: '2024-05-15',
      estado: 'completada',
      tutor: 'Dra. María García',
    },
    {
      id: 3,
      titulo: 'Presentación de avances',
      descripcion: 'Preparar presentación de los avances del proyecto',
      fecha_entrega: '2024-05-25',
      estado: 'pendiente',
      tutor: 'Dr. Carlos Rodríguez',
    },
  ]);

  const getEstadoChip = (estado) => {
    switch (estado) {
      case 'completada':
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Completada"
            color="success"
            size="small"
          />
        );
      case 'pendiente':
        return (
          <Chip
            icon={<PendingIcon />}
            label="Pendiente"
            color="warning"
            size="small"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Mis Tareas
      </Typography>
      <Grid container spacing={3}>
        {tareas.map((tarea) => (
          <Grid item xs={12} md={6} key={tarea.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" component="div">
                    {tarea.titulo}
                  </Typography>
                  {getEstadoChip(tarea.estado)}
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  Tutor: {tarea.tutor}
                </Typography>
                <Typography variant="body2" paragraph>
                  {tarea.descripcion}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Fecha de entrega: {new Date(tarea.fecha_entrega).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Tareas; 