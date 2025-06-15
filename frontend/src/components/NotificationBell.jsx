import React, { useState, useEffect } from 'react';
import {
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Typography,
    Box,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Button,
    CircularProgress
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    School as SchoolIcon,
    Event as EventIcon,
    Assignment as AssignmentIcon,
    CheckCircle as CheckCircleIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from './NotificationSystem';
import api from '../services/api';

const NotificationBell = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificaciones, setNotificaciones] = useState([]);
    const [contadorNoLeidas, setContadorNoLeidas] = useState(0);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const cargarNotificaciones = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/notificaciones/usuario/${user.id}`);
            if (response.data.success) {
                setNotificaciones(response.data.data);
            }
        } catch (error) {
            console.error('Error al cargar notificaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const cargarContadorNoLeidas = async () => {
        try {
            const response = await api.get(`/notificaciones/usuario/${user.id}/contador`);
            if (response.data.success) {
                setContadorNoLeidas(response.data.data);
            }
        } catch (error) {
            console.error('Error al cargar contador de notificaciones:', error);
        }
    };

    useEffect(() => {
        if (user) {
            cargarNotificaciones();
            cargarContadorNoLeidas();
            // Actualizar cada minuto
            const interval = setInterval(() => {
                cargarContadorNoLeidas();
            }, 60000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        cargarNotificaciones();
        // Marcar todas las notificaciones como leídas al abrir el menú
        handleMarcarTodasLeidas();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificacionClick = async (notificacion) => {
        try {
            if (!notificacion.leida) {
                await api.put(`/notificaciones/${notificacion.id}/leer`);
                setNotificaciones(prev =>
                    prev.map(n =>
                        n.id === notificacion.id ? { ...n, leida: true } : n
                    )
                );
                setContadorNoLeidas(prev => Math.max(0, prev - 1));
            }
            if (notificacion.enlace) {
                navigate(notificacion.enlace);
            }
            handleClose();
        } catch (error) {
            console.error('Error al marcar notificación como leída:', error);
            showNotification('Error al procesar la notificación', 'error');
        }
    };

    const handleMarcarTodasLeidas = async () => {
        try {
            await api.put(`/notificaciones/usuario/${user.id}/leer-todas`);
            setNotificaciones(prev =>
                prev.map(n => ({ ...n, leida: true }))
            );
            setContadorNoLeidas(0);
            showNotification('Todas las notificaciones marcadas como leídas', 'success');
        } catch (error) {
            console.error('Error al marcar todas las notificaciones como leídas:', error);
            showNotification('Error al marcar las notificaciones como leídas', 'error');
        }
    };

    const handleDeleteNotification = async (id, event) => {
        event.stopPropagation();
        try {
            await api.delete(`/notificaciones/${id}`);
            setNotificaciones(prev => prev.filter(n => n.id !== id));
            setContadorNoLeidas(prev => Math.max(0, prev - 1));
            showNotification('Notificación eliminada', 'success');
        } catch (error) {
            console.error('Error al eliminar notificación:', error);
            showNotification('Error al eliminar la notificación', 'error');
        }
    };

    const getIconoTipo = (tipo) => {
        switch (tipo) {
            case 'tutoria':
                return <SchoolIcon color="primary" />;
            case 'evento':
                return <EventIcon color="primary" />;
            case 'tarea':
                return <AssignmentIcon color="primary" />;
            default:
                return <CheckCircleIcon color="primary" />;
        }
    };

    return (
        <>
            <IconButton
                color="inherit"
                onClick={handleClick}
                sx={{
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                }}
            >
                {contadorNoLeidas > 0 ? (
                    <Badge badgeContent={contadorNoLeidas} color="error">
                        <NotificationsIcon />
                    </Badge>
                ) : (
                    <NotificationsIcon />
                )}
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: 360,
                        maxHeight: 480,
                    },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Notificaciones</Typography>
                    {contadorNoLeidas > 0 && (
                        <Button
                            size="small"
                            onClick={handleMarcarTodasLeidas}
                            sx={{ textTransform: 'none' }}
                        >
                            Marcar todas como leídas
                        </Button>
                    )}
                </Box>
                <Divider />
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : notificaciones.length === 0 ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            No hay notificaciones
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>
                        {notificaciones.map((notificacion) => (
                            <ListItem
                                key={notificacion.id}
                                button
                                onClick={() => handleNotificacionClick(notificacion)}
                                sx={{
                                    backgroundColor: notificacion.leida ? 'inherit' : 'action.hover',
                                    '&:hover': {
                                        backgroundColor: 'action.selected',
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    {getIconoTipo(notificacion.tipo)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={notificacion.titulo}
                                    secondary={
                                        <>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {notificacion.mensaje}
                                            </Typography>
                                            <br />
                                            <Typography
                                                component="span"
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {new Date(notificacion.fecha_creacion).toLocaleString()}
                                            </Typography>
                                        </>
                                    }
                                />
                                <IconButton 
                                    edge="end" 
                                    aria-label="delete" 
                                    onClick={(e) => handleDeleteNotification(notificacion.id, e)}
                                    sx={{ ml: 1 }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Menu>
        </>
    );
};

export default NotificationBell; 