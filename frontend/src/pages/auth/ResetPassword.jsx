import { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Snackbar, Alert, InputAdornment, IconButton
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import logo from '../../assets/logo-uniminuto.png';
import api from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState({
    correo: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { token } = useParams();

  // Validación del correo institucional
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-ZñÑ._-]+@uniminuto\.edu\.co$/;
    return emailRegex.test(email);
  };

  // Validación de la contraseña
  const validatePassword = (password) => {
    // Solo permite letras (incluyendo ñ), números y caracteres seguros
    const passwordRegex = /^[a-zA-ZñÑ0-9@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    return passwordRegex.test(password);
  };

  // Validación de la fortaleza de la contraseña
  const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-ZÑ]/.test(password);
    const hasLowerCase = /[a-zñ]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setCorreo(value);
    
    if (!validateEmail(value) && value !== '') {
      setErrors(prev => ({
        ...prev,
        correo: 'El correo debe ser @uniminuto.edu.co y solo puede contener letras, ñ, punto, guion y underscore'
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        correo: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (!validatePassword(value) && value !== '') {
      setErrors(prev => ({
        ...prev,
        password: 'La contraseña solo puede contener letras, números y caracteres especiales seguros'
      }));
    } else if (!validatePasswordStrength(value) && value !== '') {
      setErrors(prev => ({
        ...prev,
        password: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial'
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        password: ''
      }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (value !== password && value !== '') {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Las contraseñas no coinciden'
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    setShowSuccess(false);
    setShowError(false);

    // Validaciones antes de enviar
    if (!correo || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos.');
      setShowError(true);
      setLoading(false);
      return;
    }

    if (!validateEmail(correo)) {
      setError('El formato del correo institucional no es válido.');
      setShowError(true);
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('La contraseña contiene caracteres no permitidos.');
      setShowError(true);
      setLoading(false);
      return;
    }

    if (!validatePasswordStrength(password)) {
      setError('La contraseña no cumple con los requisitos de seguridad.');
      setShowError(true);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setShowError(true);
      setLoading(false);
      return;
    }

    try {
      await api.post(`/login/reset-password/${token}`, {
        correo_institucional: correo,
        nueva_contraseña: password
      });
      setSuccess('¡Contraseña restablecida con éxito! Ahora puedes iniciar sesión.');
      setShowSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña. Intenta de nuevo.');
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
          maxWidth: 400,
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
          variant="h5"
          align="center"
          sx={{ mb: 2, fontWeight: 700, color: '#facc15' }}
        >
          Restablecer Contraseña
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Correo institucional"
            name="correo_institucional"
            value={correo}
            onChange={handleEmailChange}
            fullWidth
            required
            type="email"
            error={!!errors.correo}
            helperText={errors.correo}
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
          <TextField
            label="Nueva contraseña"
            name="nueva_contraseña"
            value={password}
            onChange={handlePasswordChange}
            fullWidth
            required
            type={showPassword ? 'text' : 'password'}
            error={!!errors.password}
            helperText={errors.password}
            InputLabelProps={{ style: { color: '#cbd5e1' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#60a5fa' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" sx={{ color: '#facc15' }}>
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
          <TextField
            label="Confirmar contraseña"
            name="confirmar_contraseña"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            fullWidth
            required
            type={showConfirm ? 'text' : 'password'}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputLabelProps={{ style: { color: '#cbd5e1' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#60a5fa' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm((v) => !v)} edge="end" sx={{ color: '#facc15' }}>
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
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
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 2,
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
            {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
          </Button>
        </Box>
        <Button
          variant="text"
          fullWidth
          sx={{ mt: 2, color: '#f8fafc', fontWeight: 600, textTransform: 'none' }}
          onClick={() => navigate('/login')}
        >
          Volver al inicio de sesión
        </Button>
      </Paper>
      <Snackbar open={showError} autoHideDuration={5000} onClose={() => setShowError(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
      </Snackbar>
      <Snackbar open={showSuccess} autoHideDuration={5000} onClose={() => setShowSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%' }}>{success}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ResetPassword; 