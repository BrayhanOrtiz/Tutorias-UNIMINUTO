import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  ExitToApp as LogoutIcon,
  Schedule as ScheduleIcon,
  Task as TaskIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const getMenuItems = (rol_id) => {
  switch (rol_id) {
    case 1: // Estudiante
      return [
        { text: 'Inicio', icon: <DashboardIcon />, path: '/estudiante' },
        { text: 'Mis Tutorías', icon: <AssignmentIcon />, path: '/estudiante/tutorias' },
        { text: 'Mis Tareas', icon: <TaskIcon />, path: '/estudiante/tareas' },
        { text: 'Horarios', icon: <ScheduleIcon />, path: '/estudiante/horarios' },
      ];
    case 2: // Docente
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/docente' },
        { text: 'Tutorías', icon: <AssignmentIcon />, path: '/docente/tutorias' },
        { text: 'Horarios', icon: <ScheduleIcon />, path: '/docente/horarios' },
        { text: 'Reportes', icon: <AssessmentIcon />, path: '/docente/reportes' },
      ];
    case 3: // Administrador
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
        { text: 'Tutorías', icon: <AssignmentIcon />, path: '/admin/tutorias' },
        { text: 'Usuarios', icon: <PeopleIcon />, path: '/admin/usuarios' },
        { text: 'Reportes', icon: <AssessmentIcon />, path: '/admin/reportes' },
      ];
    default:
      return [];
  }
};

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = getMenuItems(user?.rol_id);

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Tutorías UNIMINUTO
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {user?.nombre || 'Usuario'} - {user?.nombre_rol || 'Rol'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 