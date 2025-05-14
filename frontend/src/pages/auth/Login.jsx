import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import logo from '../../assets/logo-uniminuto.png';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    correo_institucional: '',
    contraseña: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (showError) {
      setShowError(false);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowError(false);
    try {
      const result = await login(credentials);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
        setShowError(true);
      }
    } catch {
      setError('Error al iniciar sesión. Por favor, intente nuevamente.');
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
          variant="h4"
          align="center"
          sx={{
            mb: 2,
            fontWeight: 700,
            letterSpacing: 1,
            color: '#facc15',
          }}
        >
          Iniciar Sesión
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Correo institucional"
            name="correo_institucional"
            value={credentials.correo_institucional}
            onChange={handleChange}
            fullWidth
            required
            autoFocus
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
            label="Contraseña"
            name="contraseña"
            value={credentials.contraseña}
            onChange={handleChange}
            fullWidth
            required
            type={showPassword ? 'text' : 'password'}
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
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </Box>
        <Button
          variant="text"
          fullWidth
          sx={{ mt: 1, color: '#f8fafc', fontWeight: 600, textTransform: 'none' }}
          onClick={() => navigate('/forgot-password')}
        >
          ¿Olvidaste tu contraseña? Recuperar acceso
        </Button>
        <Button
          variant="text"
          fullWidth
          sx={{ mt: 2, color: '#f8fafc', fontWeight: 600, textTransform: 'none' }}
          onClick={() => navigate('/register')}
        >
          ¿No tienes cuenta? Regístrate
        </Button>
      </Paper>
      <Snackbar
        open={showError}
        autoHideDuration={5000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
