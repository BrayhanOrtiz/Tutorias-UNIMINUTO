import React, { useState } from 'react';
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
    Avatar,
    Menu,
    MenuItem,
    Divider,
    useTheme,
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Schedule as ScheduleIcon,
    School as SchoolIcon,
    Assessment as AssessmentIcon,
    ExitToApp as LogoutIcon,
    Person as PersonIcon,
    Assignment as AssignmentIcon,
    SupervisorAccount as SupervisorAccountIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const Layout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogoutClick = () => {
        handleMenuClose();
        setLogoutDialogOpen(true);
    };

    const handleLogoutConfirm = () => {
        setLogoutDialogOpen(false);
        logout();
        navigate('/login');
    };

    const handleLogoutCancel = () => {
        setLogoutDialogOpen(false);
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.startsWith('/docente')) {
            if (path === '/docente') return 'Dashboard Docente';
            if (path.includes('/horarios')) return 'Horarios';
            if (path.includes('/tutorias')) return 'Tutorías';
            if (path.includes('/reportes')) return 'Reportes';
            return 'Docente';
        }
        if (path.startsWith('/estudiante')) {
            if (path === '/estudiante') return 'Dashboard Estudiante';
            if (path.includes('/tutorias')) return 'Tutorías';
            if (path.includes('/tareas')) return 'Tareas BETA';
            if (path.includes('/horarios')) return 'Horarios BETA';
            return 'Estudiante';
        }
        if (path.startsWith('/admin')) {
            if (path === '/admin') return 'Panel de Administración';
            if (path.includes('/admin/gestion-docentes')) return 'Gestión de Docentes';
            if (path.includes('/admin/reportes-tutorias')) return 'Reportes de Tutorías';
            if (path.includes('/admin/gestion-encuestas')) return 'Gestión de Preguntas';
            if (path.includes('/admin/listado-encuestas')) return 'Listado de Encuestas';
            return 'Administración';
        }
        return 'Dashboard';
    };

    const getMenuItems = () => {
        if (user?.rol_id === 2) {
            return [
                { text: 'Dashboard', icon: <DashboardIcon />, path: '/docente' },
                { text: 'Horarios', icon: <ScheduleIcon />, path: '/docente/horarios' },
                { text: 'Tutorías', icon: <SchoolIcon />, path: '/docente/tutorias' },
                { text: 'Reportes', icon: <AssessmentIcon />, path: '/docente/reportes' }
            ];
        } else if (user?.rol_id === 1) {
            return [
                { text: 'Dashboard', icon: <DashboardIcon />, path: '/estudiante' },
                { text: 'Tutorías', icon: <SchoolIcon />, path: '/estudiante/tutorias' },
                { text: 'Tareas BETA', icon: <AssignmentIcon />, path: '/estudiante/tareas' },
                { text: 'Horarios BETA', icon: <ScheduleIcon />, path: '/estudiante/horarios' }
            ];
        } else if (user?.rol_id === 3) {
            return [
                { text: 'Panel Admin', icon: <DashboardIcon />, path: '/admin' },
                { text: 'Gestión Docentes', icon: <SupervisorAccountIcon />, path: '/admin/gestion-docentes' },
                { text: 'Reportes Tutorías', icon: <AssessmentIcon />, path: '/admin/reportes-tutorias' },
                { text: 'Gestión Preguntas', icon: <AssignmentIcon />, path: '/admin/gestion-encuestas' },
                { text: 'Listado Encuestas', icon: <AssessmentIcon />, path: '/admin/listado-encuestas' }
            ];
        }
        return [];
    };

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    UNIMINUTO
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {getMenuItems().map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => {
                            navigate(item.path);
                            if (isMobile) setMobileOpen(false);
                        }}
                        selected={location.pathname === item.path}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
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
                    bgcolor: 'white',
                    color: 'text.primary',
                    boxShadow: 1
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
                    
                    {/* Título de la página actual */}
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        {getPageTitle()}
                    </Typography>

                    {/* Información del usuario */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {user?.nombre?.charAt(0)?.toUpperCase() + user?.nombre?.slice(1)} {user?.apellido?.charAt(0)?.toUpperCase() + user?.apellido?.slice(1)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {user?.rol_id === 1 ? 'Estudiante' : user?.rol_id === 2 ? 'Docente' : 'Administrador'}
                        </Typography>
                        <IconButton
                            onClick={handleMenuOpen}
                            size="small"
                            sx={{ ml: 2 }}
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                {user?.nombre?.charAt(0)?.toUpperCase()}
                            </Avatar>
                        </IconButton>
                    </Box>
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
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleLogoutClick}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Cerrar Sesión
                </MenuItem>
            </Menu>

            <Dialog
                open={logoutDialogOpen}
                onClose={handleLogoutCancel}
                aria-labelledby="logout-dialog-title"
            >
                <DialogTitle id="logout-dialog-title">
                    Confirmar cierre de sesión
                </DialogTitle>
                <DialogContent>
                    ¿Está seguro que desea cerrar sesión?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogoutCancel} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleLogoutConfirm} color="primary" variant="contained">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mt: '64px'
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout; 