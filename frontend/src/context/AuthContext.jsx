import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token al cargar la aplicación
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get('/usuarios/me');
      setUser(response.data.data);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      const { data } = response.data;
      
      if (data && data.rol_id) {
        localStorage.setItem('token', response.data.token);
        setUser(data);
        return { success: true, user: data };
      } else {
        throw new Error('Respuesta de login inválida');
      }
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.response) {
        // Error de respuesta del servidor
        if (error.response.status === 401) {
          errorMessage = 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.';
        } else if (error.response.status === 404) {
          errorMessage = 'Usuario no encontrado.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // Error de red
        errorMessage = 'Error de conexión. Por favor, verifica tu conexión a internet.';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext; 