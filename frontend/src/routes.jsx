import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Layout from './components/layout/Layout';
import DashboardEstudiante from './pages/estudiante/DashboardEstudiante';
import DashboardDocente from './pages/docente/DashboardDocente';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import Tareas from './pages/estudiante/Tareas';
import Horarios from './pages/estudiante/Horarios';
import Tutorias from './pages/estudiante/Tutorias';

// Componente para rutas protegidas con redirección basada en rol
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol_id)) {
    // Redirigir según el rol
    switch (user.rol_id) {
      case 1: // Estudiante
        return <Navigate to="/estudiante" />;
      case 2: // Docente
        return <Navigate to="/docente" />;
      case 3: // Administrador
        return <Navigate to="/admin" />;
      default:
        return <Navigate to="/login" />;
    }
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  // Redirección inicial basada en rol
  const getInitialRoute = () => {
    if (!user) return '/login';
    switch (user.rol_id) {
      case 1: return '/estudiante';  // Estudiante
      case 2: return '/docente';     // Docente
      case 3: return '/admin';       // Administrador
      default: return '/login';
    }
  };

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={
        user ? <Navigate to={getInitialRoute()} /> : <Login />
      } />

      {/* Rutas de estudiante */}
      <Route
        path="/estudiante"
        element={
          <PrivateRoute allowedRoles={[1]}>
            <Layout>
              <DashboardEstudiante />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/estudiante/tutorias"
        element={
          <PrivateRoute allowedRoles={[1]}>
            <Layout>
              <Tutorias />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/estudiante/tareas"
        element={
          <PrivateRoute allowedRoles={[1]}>
            <Layout>
              <Tareas />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/estudiante/horarios"
        element={
          <PrivateRoute allowedRoles={[1]}>
            <Layout>
              <Horarios />
            </Layout>
          </PrivateRoute>
        }
      />

      {/* Rutas de docente */}
      <Route
        path="/docente/*"
        element={
          <PrivateRoute allowedRoles={[2]}>
            <Layout>
              <DashboardDocente />
            </Layout>
          </PrivateRoute>
        }
      />

      {/* Rutas de administrador */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute allowedRoles={[3]}>
            <Layout>
              <DashboardAdmin />
            </Layout>
          </PrivateRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to={getInitialRoute()} replace />} />
      <Route path="*" element={<Navigate to={getInitialRoute()} replace />} />
    </Routes>
  );
};

export default AppRoutes; 