import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import axios from 'axios';

const AppointmentForm = ({ onAppointmentCreated }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    tutorId: '',
    subject: '',
    date: null,
    time: '',
    duration: 60,
    location: 'virtual',
    status: 'pending',
    notes: ''
  });

  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, tutorsRes, subjectsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/students'),
          axios.get('http://localhost:5000/api/tutors'),
          axios.get('http://localhost:5000/api/subjects')
        ]);

        setStudents(studentsRes.data);
        setTutors(tutorsRes.data);
        setSubjects(subjectsRes.data);
      } catch (error) {
        setError('Error al cargar los datos iniciales');
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (newDate) => {
    setFormData(prev => ({
      ...prev,
      date: newDate
    }));
  };

  const validateForm = () => {
    if (!formData.studentId || !formData.tutorId || !formData.subject || !formData.date || !formData.time) {
      setError('Por favor complete todos los campos requeridos');
      return false;
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError('La fecha no puede ser anterior a hoy');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/appointments', formData);
      setSuccess('Cita creada exitosamente');
      setFormData({
        studentId: '',
        tutorId: '',
        subject: '',
        date: null,
        time: '',
        duration: 60,
        location: 'virtual',
        status: 'pending',
        notes: ''
      });
      if (onAppointmentCreated) {
        onAppointmentCreated(response.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear la cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Crear Nueva Cita
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Estudiante</InputLabel>
            <Select
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
            >
              {students.map(student => (
                <MenuItem key={student._id} value={student._id}>
                  {student.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Tutor</InputLabel>
            <Select
              name="tutorId"
              value={formData.tutorId}
              onChange={handleChange}
              required
            >
              {tutors.map(tutor => (
                <MenuItem key={tutor._id} value={tutor._id}>
                  {tutor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Materia</InputLabel>
            <Select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              {subjects.map(subject => (
                <MenuItem key={subject._id} value={subject._id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
              label="Fecha"
              value={formData.date}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth required />}
              minDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="time"
            name="time"
            label="Hora"
            value={formData.time}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            name="duration"
            label="Duración (minutos)"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Ubicación</InputLabel>
            <Select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >
              <MenuItem value="virtual">Virtual</MenuItem>
              <MenuItem value="presencial">Presencial</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            name="notes"
            label="Notas"
            value={formData.notes}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Crear Cita'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppointmentForm; 