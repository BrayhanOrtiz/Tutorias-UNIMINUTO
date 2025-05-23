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
  Link,
  InputAdornment,
  IconButton,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Email, Lock, CalendarMonth, Badge, Visibility, VisibilityOff, School } from '@mui/icons-material';
import logo from '../../assets/logo-uniminuto.png';

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
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    console.log('useEffect de carreras ejecutado');
    const fetchCarreras = async () => {
      try {
        const res = await api.get('/carreras');
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
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError('');
    setShowError(false);

    const fieldError = validateField(name, value, form);
    setFormErrors(prev => ({ ...prev, [name]: fieldError }));
  };

  const validateField = (name, value, currentForm) => {
    let error = '';
    switch (name) {
      case 'nombres':
        if (!value) error = 'El nombre es requerido';
        else if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/.test(value)) error = 'Solo se permiten letras y ñ';
        break;
      case 'apellidos':
        if (!value) error = 'El apellido es requerido';
        else if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/.test(value)) error = 'Solo se permiten letras y ñ';
        break;
      case 'id':
        if (!value) error = 'El ID es requerido';
        else if (!/^[0-9]*$/.test(value)) error = 'Solo se permiten números';
        else if (value.length > 10) error = 'Máximo 10 dígitos';
        break;
      case 'correo_institucional':
        if (!value) error = 'El correo institucional es requerido';
        else if (!/^[^\s@]+@uniminuto\.edu\.co$/.test(value)) error = 'Debe ser un correo @uniminuto.edu.co válido';
        break;
      case 'contraseña':
        if (!value) error = 'La contraseña es requerida';
        else if (value.length > 100) error = 'Máximo 100 caracteres';
        break;
      case 'carrera_id':
        if (!value) error = 'La carrera es requerida';
        break;
      case 'fecha_nacimiento':
        if (!value) error = 'La fecha de nacimiento es requerida';
        break;
      default:
        break;
    }
    return error;
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;
    Object.keys(form).forEach(key => {
      const error = validateField(key, form[key], form);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    });
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowError(false);
    setShowSuccess(false);
    setSuccess('');

    if (!validateForm()) {
      setError('Por favor, corrija los errores en el formulario.');
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
      await api.post('/usuarios/estudiantes', {
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
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'auto',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 500,
          borderRadius: 5,
          background: 'rgba(30,41,59,0.85)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src={logo} alt="UNIMINUTO" style={{ width: 90, marginBottom: 16, borderRadius: 8 }} />
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 2,
            fontWeight: 700,
            letterSpacing: 1,
            color: '#facc15',
          }}
        >
          Regístrate
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombres"
                name="nombres"
                id="nombres"
                value={form.nombres}
                onChange={handleChange}
                fullWidth
                required
                autoFocus
                InputLabelProps={{ style: { color: '#cbd5e1' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge sx={{ color: '#60a5fa' }} />
                    </InputAdornment>
                  ),
                  style: { color: '#f1f5f9' },
                }}
                error={!!formErrors.nombres}
                helperText={formErrors.nombres}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#93c5fd' },
                    '&.Mui-focused fieldset': { borderColor: '#facc15' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellidos"
                name="apellidos"
                id="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.apellidos}
                helperText={formErrors.apellidos}
                InputLabelProps={{ style: { color: '#cbd5e1' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge sx={{ color: '#60a5fa' }} />
                    </InputAdornment>
                  ),
                  style: { color: '#f1f5f9' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#93c5fd' },
                    '&.Mui-focused fieldset': { borderColor: '#facc15' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ID"
                name="id"
                id="id"
                value={form.id}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.id}
                helperText={formErrors.id}
                InputLabelProps={{ style: { color: '#cbd5e1' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge sx={{ color: '#60a5fa' }} />
                    </InputAdornment>
                  ),
                  style: { color: '#f1f5f9' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#93c5fd' },
                    '&.Mui-focused fieldset': { borderColor: '#facc15' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Correo institucional"
                name="correo_institucional"
                id="correo_institucional"
                value={form.correo_institucional}
                onChange={handleChange}
                fullWidth
                required
                type="email"
                error={!!formErrors.correo_institucional}
                helperText={formErrors.correo_institucional}
                InputLabelProps={{ style: { color: '#cbd5e1' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#60a5fa' }} />
                    </InputAdornment>
                  ),
                  style: { color: '#f1f5f9' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#93c5fd' },
                    '&.Mui-focused fieldset': { borderColor: '#facc15' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contraseña"
                name="contraseña"
                id="contraseña"
                value={form.contraseña}
                onChange={handleChange}
                fullWidth
                required
                type={showPassword ? 'text' : 'password'}
                error={!!formErrors.contraseña}
                helperText={formErrors.contraseña}
                InputLabelProps={{ style: { color: '#cbd5e1' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#60a5fa' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(prev => !prev)}
                        edge="end"
                        disabled={loading}
                        sx={{ color: '#facc15' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: { color: '#f1f5f9' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#93c5fd' },
                    '&.Mui-focused fieldset': { borderColor: '#facc15' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de Nacimiento"
                name="fecha_nacimiento"
                id="fecha_nacimiento"
                value={form.fecha_nacimiento}
                onChange={handleChange}
                fullWidth
                required
                type="date"
                error={!!formErrors.fecha_nacimiento}
                helperText={formErrors.fecha_nacimiento}
                InputLabelProps={{ shrink: true, style: { color: '#cbd5e1' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonth sx={{ color: '#60a5fa' }} />
                    </InputAdornment>
                  ),
                  style: { color: '#f1f5f9' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#93c5fd' },
                    '&.Mui-focused fieldset': { borderColor: '#facc15' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Seleccione la Carrera"
                name="carrera_id"
                id="carrera_id"
                value={form.carrera_id}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.carrera_id}
                helperText={formErrors.carrera_id}
                InputLabelProps={{ style: { color: '#cbd5e1' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <School sx={{ color: '#60a5fa' }} />
                    </InputAdornment>
                  ),
                  style: { color: '#f1f5f9' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#93c5fd' },
                    '&.Mui-focused fieldset': { borderColor: '#facc15' },
                  },
                }}
              >
                <MenuItem value="">Seleccione la Carrera</MenuItem>
                {carreras.map((carrera) => (
                  <MenuItem key={carrera.id} value={carrera.id}>
                    {carrera.nombre_carrera || carrera.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  mt: 1,
                  fontWeight: 600,
                  borderRadius: 2,
                  height: 48,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  backgroundColor: '#3b82f6',
                  boxShadow: '0 4px 14px #2563eb33',
                  '&:hover': { backgroundColor: '#2563eb' },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Button
          variant="text"
          fullWidth
          sx={{ mt: 2, color: '#f8fafc', fontWeight: 600, textTransform: 'none' }}
          onClick={() => navigate('/login')}
        >
          ¿Ya tienes cuenta? Inicia sesión
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