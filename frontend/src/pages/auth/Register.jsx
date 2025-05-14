import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    id: '',
    correo_institucional: '',
    contraseña: '',
    carrera_id: '',
    fecha_nacimiento: ''
  });
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    console.log('useEffect de carreras ejecutado');
    const fetchCarreras = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/carreras');
        console.log('Carreras recibidas:', res.data.data);
        setCarreras(res.data.data || []);
      } catch (err) {
        setCarreras([]);
        console.error('Error al cargar carreras', err);
      }
    };
    fetchCarreras();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setShowError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowError(false);
    setShowSuccess(false);
    setSuccess('');
    // Validación básica
    if (!form.nombres || !form.apellidos || !form.id || !form.correo_institucional || !form.contraseña || !form.carrera_id) {
      setError('Por favor, completa todos los campos.');
      setShowError(true);
      setLoading(false);
      return;
    }
    if (!form.correo_institucional.endsWith('@uniminuto.edu.co')) {
      setError('El correo debe ser institucional (@uniminuto.edu.co)');
      setShowError(true);
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post('http://localhost:3000/api/usuarios/estudiantes', {
        id: form.id,
        nombre: form.nombres,
        apellido: form.apellidos,
        correo_institucional: form.correo_institucional,
        contraseña: form.contraseña,
        carrera_id: form.carrera_id,
        fecha_nacimiento: form.fecha_nacimiento
      });
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setShowSuccess(true);
      setForm({
        nombres: '',
        apellidos: '',
        id: '',
        correo_institucional: '',
        contraseña: '',
        carrera_id: '',
        fecha_nacimiento: ''
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar. Intenta de nuevo.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'auto'
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 420,
          borderRadius: 4,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 3,
            fontWeight: 700,
            letterSpacing: 1,
            color: '#1e293b',
            background: 'linear-gradient(90deg, #2563eb, #06b6d4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          REGÍSTRATE
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nombres"
            name="nombres"
            id="nombres"
            value={form.nombres}
            onChange={handleChange}
            fullWidth
            required
            autoFocus
          />
          <TextField
            label="Apellidos"
            name="apellidos"
            id="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="ID"
            name="id"
            id="id"
            value={form.id}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Correo Institucional"
            name="correo_institucional"
            id="correo_institucional"
            value={form.correo_institucional}
            onChange={handleChange}
            fullWidth
            required
            type="email"
          />
          <TextField
            label="Contraseña"
            name="contraseña"
            id="contraseña"
            value={form.contraseña}
            onChange={handleChange}
            fullWidth
            required
            type="password"
          />
          <TextField
            label="Fecha de Nacimiento"
            name="fecha_nacimiento"
            id="fecha_nacimiento"
            value={form.fecha_nacimiento}
            onChange={handleChange}
            fullWidth
            required
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Seleccione la Carrera"
            name="carrera_id"
            id="carrera_id"
            value={form.carrera_id}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="">Seleccione la Carrera</MenuItem>
            {carreras.map((carrera) => (
              <MenuItem key={carrera.id} value={carrera.id}>
                {carrera.nombre_carrera || carrera.nombre}
              </MenuItem>
            ))}
          </TextField>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2, fontWeight: 600, borderRadius: 2, height: 48, fontSize: '1.1rem', textTransform: 'none', boxShadow: '0 4px 14px #2563eb33' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrate'}
          </Button>
        </Box>
        <Button
          variant="text"
          fullWidth
          sx={{ mt: 2, color: '#334155', fontWeight: 600, textTransform: 'none' }}
          onClick={() => navigate('/login')}
        >
          Volver al inicio de sesión
        </Button>
      </Paper>
      <Snackbar open={showError} autoHideDuration={5000} onClose={() => setShowError(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
      </Snackbar>
      <Snackbar open={showSuccess} autoHideDuration={3000} onClose={() => setShowSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%' }}>{success}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Register; 