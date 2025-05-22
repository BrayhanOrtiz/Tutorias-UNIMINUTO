import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Layout from './components/layout/Layout';
import DashboardEstudiante from './pages/estudiante/DashboardEstudiante';
import DocenteDashboard from './pages/docente/DocenteDashboard';
import HorariosDocente from './pages/docente/HorariosDocente';
import TutoriasDocente from './pages/docente/TutoriasDocente';
import ReportesDocente from './pages/docente/ReportesDocente';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import GestionPreguntasEncuesta from './pages/admin/GestionPreguntasEncuesta';
import ListadoEncuestas from './pages/admin/ListadoEncuestas';
import GestionDocentes from './pages/admin/GestionDocentes';
import ReportesTutorias from './pages/admin/ReportesTutorias';
import Tareas from './pages/estudiante/Tareas';
import Horarios from './pages/estudiante/Horarios';
import TutoriasEstudiante from './pages/estudiante/TutoriasEstudiante';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

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
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

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
              <TutoriasEstudiante />
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
        path="/docente"
        element={
          <PrivateRoute allowedRoles={[2]}>
            <Layout>
              <DocenteDashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/docente/horarios"
        element={
          <PrivateRoute allowedRoles={[2]}>
            <Layout>
              <HorariosDocente />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/docente/tutorias"
        element={
          <PrivateRoute allowedRoles={[2]}>
            <Layout>
              <TutoriasDocente />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/docente/reportes"
        element={
          <PrivateRoute allowedRoles={[2]}>
            <Layout>
              <ReportesDocente />
            </Layout>
          </PrivateRoute>
        }
      />

      {/* Rutas de administrador */}
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={[3]}>
            <Layout>
              <DashboardAdmin />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/gestion-docentes"
        element={
          <PrivateRoute allowedRoles={[3]}>
            <Layout>
              <GestionDocentes />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/reportes-tutorias"
        element={
          <PrivateRoute allowedRoles={[3]}>
            <Layout>
              <ReportesTutorias />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/gestion-encuestas"
        element={
          <PrivateRoute allowedRoles={[3]}>
            <Layout>
              <GestionPreguntasEncuesta />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/listado-encuestas"
        element={
          <PrivateRoute allowedRoles={[3]}>
            <Layout>
              <ListadoEncuestas />
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