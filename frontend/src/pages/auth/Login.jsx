import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../components/NotificationSystem';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import logo from '../../assets/logo-uniminuto.png';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const [credentials, setCredentials] = useState({
    correo_institucional: '',
    contraseña: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Efecto para mostrar el mensaje de error persistido al cargar el componente
  useEffect(() => {
    const errorMessage = localStorage.getItem('loginError');
    if (errorMessage) {
      showNotification(errorMessage, 'error', 6000);
      localStorage.removeItem('loginError');
    }
  }, [showNotification]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!credentials.correo_institucional || !credentials.contraseña) {
      showNotification('Por favor, completa todos los campos', 'warning');
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(credentials);
      
      if (result.success) {
        showNotification('Inicio de sesión exitoso', 'success');
        // Pequeño retraso antes de la navegación
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        // Guardar el mensaje de error en localStorage
        localStorage.setItem('loginError', result.error);
        // Recargar la página
        window.location.reload();
      }
    } catch (error) {
      console.error('Error en login:', error);
      // Guardar el mensaje de error en localStorage
      localStorage.setItem('loginError', 'Error al iniciar sesión. Por favor, intente nuevamente.');
      // Recargar la página
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }, [credentials, login, navigate, showNotification]);

  const handleTogglePassword = useCallback((e) => {
    e.preventDefault();
    setShowPassword(prev => !prev);
  }, []);

  const handleNavigation = useCallback((path) => (e) => {
    e.preventDefault();
    navigate(path);
  }, [navigate]);

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
            disabled={loading}
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
            disabled={loading}
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
                    onClick={handleTogglePassword}
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
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
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
              position: 'relative',
            }}
          >
            {loading ? (
              <>
                <CircularProgress
                  size={24}
                  sx={{
                    color: '#fff',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
                <span style={{ visibility: 'hidden' }}>Ingresando...</span>
              </>
            ) : (
              'Ingresar'
            )}
          </Button>
        </Box>
        <Button
          variant="text"
          fullWidth
          disabled={loading}
          sx={{ mt: 1, color: '#f8fafc', fontWeight: 600, textTransform: 'none' }}
          onClick={handleNavigation('/forgot-password')}
        >
          ¿Olvidaste tu contraseña? Recuperar acceso
        </Button>
        <Button
          variant="text"
          fullWidth
          disabled={loading}
          sx={{ mt: 2, color: '#f8fafc', fontWeight: 600, textTransform: 'none' }}
          onClick={handleNavigation('/register')}
        >
          ¿No tienes cuenta? Regístrate
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
