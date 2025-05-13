import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { AccessTime as AccessTimeIcon } from '@mui/icons-material';

const Horarios = () => {
  // Estado de ejemplo para los horarios
  const [horarios] = useState([
    {
      id: 1,
      dia: 'Lunes',
      hora_inicio: '08:00',
      hora_fin: '09:30',
      tutor: 'Dr. Juan Pérez',
      materia: 'Metodología de la Investigación',
      salon: 'A-101',
      estado: 'confirmada',
    },
    {
      id: 2,
      dia: 'Miércoles',
      hora_inicio: '10:00',
      hora_fin: '11:30',
      tutor: 'Dra. María García',
      materia: 'Estadística Aplicada',
      salon: 'B-203',
      estado: 'pendiente',
    },
    {
      id: 3,
      dia: 'Viernes',
      hora_inicio: '14:00',
      hora_fin: '15:30',
      tutor: 'Dr. Carlos Rodríguez',
      materia: 'Proyecto de Grado',
      salon: 'C-305',
      estado: 'confirmada',
    },
  ]);

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const horasDia = ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00'];

  const getEstadoChip = (estado) => {
    switch (estado) {
      case 'confirmada':
        return (
          <Chip
            label="Confirmada"
            color="success"
            size="small"
          />
        );
      case 'pendiente':
        return (
          <Chip
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
        Horarios de Tutorías
      </Typography>

      {/* Vista de lista */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Próximas Tutorías
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Día</TableCell>
                  <TableCell>Horario</TableCell>
                  <TableCell>Tutor</TableCell>
                  <TableCell>Materia</TableCell>
                  <TableCell>Salón</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {horarios.map((horario) => (
                  <TableRow key={horario.id}>
                    <TableCell>{horario.dia}</TableCell>
                    <TableCell>
                      {horario.hora_inicio} - {horario.hora_fin}
                    </TableCell>
                    <TableCell>{horario.tutor}</TableCell>
                    <TableCell>{horario.materia}</TableCell>
                    <TableCell>{horario.salon}</TableCell>
                    <TableCell>{getEstadoChip(horario.estado)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Vista de calendario semanal */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Calendario Semanal
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Hora</TableCell>
                  {diasSemana.map((dia) => (
                    <TableCell key={dia}>{dia}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {horasDia.map((hora) => (
                  <TableRow key={hora}>
                    <TableCell>{hora}</TableCell>
                    {diasSemana.map((dia) => {
                      const horario = horarios.find(
                        (h) => h.dia === dia && h.hora_inicio === hora
                      );
                      return (
                        <TableCell key={`${dia}-${hora}`}>
                          {horario ? (
                            <Box>
                              <Typography variant="subtitle2">
                                {horario.materia}
                              </Typography>
                              <Typography variant="caption" display="block">
                                {horario.tutor}
                              </Typography>
                              <Typography variant="caption" display="block">
                                {horario.salon}
                              </Typography>
                              {getEstadoChip(horario.estado)}
                            </Box>
                          ) : null}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Horarios; 