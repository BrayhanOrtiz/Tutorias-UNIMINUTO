import { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const Tutorias = () => {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const horasDia = ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00'];

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await api.get('/horarios/tutorias');
        if (response.data.success) {
          setHorarios(response.data.data);
        } else {
          setError('Error al cargar los horarios');
        }
      } catch (error) {
        setError('Error al cargar los horarios: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchHorarios();
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchHorarios, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredHorarios = horarios.filter(horario => {
    const searchLower = searchTerm.toLowerCase();
    return (
      horario.nombre_docente.toLowerCase().includes(searchLower) ||
      horario.apellido_docente.toLowerCase().includes(searchLower) ||
      horario.nombre_carrera.toLowerCase().includes(searchLower) ||
      horario.salon.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Horarios de Tutorías
      </Typography>

      {/* Barra de búsqueda */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar por docente, carrera o salón..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

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
                  <TableCell>Docente</TableCell>
                  <TableCell>Carrera</TableCell>
                  <TableCell>Salón</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHorarios.map((horario) => (
                  <TableRow key={horario.id}>
                    <TableCell>{horario.dia_semana}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <AccessTimeIcon sx={{ mr: 1, fontSize: 20 }} />
                        {horario.hora_inicio} - {horario.hora_fin}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {horario.nombre_docente} {horario.apellido_docente}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <SchoolIcon sx={{ mr: 1, fontSize: 20 }} />
                        {horario.nombre_carrera}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <LocationIcon sx={{ mr: 1, fontSize: 20 }} />
                        {horario.salon}
                      </Box>
                    </TableCell>
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
                      const horariosDelDia = filteredHorarios.filter(
                        (h) => h.dia_semana === dia && h.hora_inicio === hora
                      );
                      return (
                        <TableCell key={`${dia}-${hora}`}>
                          {horariosDelDia.map((horario) => (
                            <Box key={horario.id} mb={1}>
                              <Typography variant="subtitle2">
                                Tutoría General
                              </Typography>
                              <Typography variant="caption" display="block">
                                {horario.nombre_docente} {horario.apellido_docente}
                              </Typography>
                              <Typography variant="caption" display="block">
                                {horario.salon}
                              </Typography>
                            </Box>
                          ))}
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

export default Tutorias; 