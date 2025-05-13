import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Snackbar,
} from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    correo_institucional: '',
    contraseña: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  // Cargar el estado del error al iniciar el componente
  useEffect(() => {
    const savedError = localStorage.getItem('loginError');
    if (savedError) {
      setError(savedError);
      setShowError(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar el error cuando el usuario empiece a escribir
    if (showError) {
      setShowError(false);
      setError('');
      localStorage.removeItem('loginError');
    }
  };

  const getRedirectPath = (rol_id) => {
    switch (rol_id) {
      case 1: return '/estudiante';  // Estudiante
      case 2: return '/docente';     // Docente
      case 3: return '/admin';       // Administrador
      default: return '/login';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowError(false);
    localStorage.removeItem('loginError');
    
    try {
      const result = await login(credentials);
      if (result.success) {
        // Limpiar el error al tener un login exitoso
        localStorage.removeItem('loginError');
        const redirectPath = getRedirectPath(result.user.rol_id);
        navigate(redirectPath);
      } else {
        setError(result.error);
        setShowError(true);
        // Guardar el error en localStorage
        localStorage.setItem('loginError', result.error);
      }
    } catch {
      const errorMessage = 'Error al iniciar sesión. Por favor, intente nuevamente.';
      setError(errorMessage);
      setShowError(true);
      // Guardar el error en localStorage
      localStorage.setItem('loginError', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
    localStorage.removeItem('loginError');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <Container 
        component="main" 
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          width: '100%'
        }}
      >
        <Card 
          elevation={3}
          sx={{ 
            width: '100%',
            maxWidth: 600,
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Typography 
              component="h1" 
              variant="h4" 
              align="center" 
              gutterBottom
              sx={{ mb: 4, fontWeight: 'bold' }}
            >
              Tutorías UNIMINUTO
            </Typography>
            <Box 
              component="form" 
              onSubmit={handleSubmit}
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                width: '100%'
              }}
            >
              <TextField
                required
                fullWidth
                id="correo_institucional"
                label="Correo institucional"
                name="correo_institucional"
                autoComplete="email"
                autoFocus
                value={credentials.correo_institucional}
                onChange={handleChange}
                disabled={loading}
                error={showError}
                size="large"
                sx={{ 
                  '& .MuiInputBase-root': {
                    height: '56px'
                  }
                }}
              />
              <TextField
                required
                fullWidth
                name="contraseña"
                label="Contraseña"
                type="password"
                id="contraseña"
                autoComplete="current-password"
                value={credentials.contraseña}
                onChange={handleChange}
                disabled={loading}
                error={showError}
                size="large"
                sx={{ 
                  '& .MuiInputBase-root': {
                    height: '56px'
                  }
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  mt: 2,
                  height: '56px',
                  fontSize: '1.1rem',
                  textTransform: 'none'
                }}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Snackbar 
        open={showError} 
        autoHideDuration={null} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login; 