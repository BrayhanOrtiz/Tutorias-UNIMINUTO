import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Paper, ButtonGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { CircularProgress, Alert } from '@mui/material';

const DocenteDashboard = () => {
    const navigate = useNavigate();
    const [selectedRange, setSelectedRange] = useState('Hoy');
    const { user } = useAuth();
    const [tutorias, setTutorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar tutorías del docente autenticado
    useEffect(() => {
        if (!user) return;
        setTutorias([]);
        setLoading(true);
        setError(null);
        const fetchTutorias = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/api/tutorias/docente/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTutorias(Array.isArray(res.data) ? res.data : (res.data.data || []));
            } catch (e) {
                setError('Error al cargar las tutorías');
            }
            setLoading(false);
        };
        fetchTutorias();
    }, [user]);

    // Métricas dinámicas
    const metricData = [
        { label: 'Tutorías', value: tutorias.length, icon: <SchoolIcon fontSize="large" color="primary" /> },
        { label: 'Estudiantes', value: new Set(tutorias.map(t => t.estudiante_id)).size, icon: <PeopleIcon fontSize="large" color="primary" /> },
        { label: 'Reportes', value: 5, icon: <AssessmentIcon fontSize="large" color="primary" /> },
        { label: 'Tareas', value: 7, icon: <AssignmentIcon fontSize="large" color="primary" /> },
    ];

    // Gráfico: tutorías por mes
    const chartData = (() => {
        const meses = {};
        tutorias.forEach(t => {
            if (t.fecha_hora_agendada) {
                const fecha = new Date(t.fecha_hora_agendada);
                const mes = fecha.toLocaleString('es-ES', { month: 'short', year: '2-digit' });
                meses[mes] = (meses[mes] || 0) + 1;
            }
        });
        return Object.entries(meses)
            .map(([name, tutorias]) => ({ name, tutorias }))
            .sort((a, b) => {
                const [mesA, anioA] = a.name.split(' ');
                const [mesB, anioB] = b.name.split(' ');
                const fechaA = new Date(`20${anioA}`, [
                    'ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'
                ].indexOf(mesA.toLowerCase()), 1);
                const fechaB = new Date(`20${anioB}`, [
                    'ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'
                ].indexOf(mesB.toLowerCase()), 1);
                return fechaA - fechaB;
            });
    })();

    const handleRangeChange = (range) => setSelectedRange(range);

    const menuItems = [
        {
            title: 'Mis Horarios',
            description: 'Gestiona tus horarios de tutoría y disponibilidad.',
            icon: <CalendarMonthIcon sx={{ fontSize: 40 }} />,
            path: '/docente/horarios',
            color: '#FFD600'
        },
        {
            title: 'Tutorías',
            description: 'Revisa y gestiona tus próximas sesiones de tutoría.',
            icon: <SchoolIcon sx={{ fontSize: 40 }} />,
            path: '/docente/tutorias',
            color: '#0033A0'
        },
        {
            title: 'Reportes',
            description: 'Visualiza el rendimiento y la participación en tus tutorías.',
            icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
            path: '/docente/reportes',
            color: '#E2001A'
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Panel de Control - Docente
            </Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <>
                    <Grid container spacing={2} mb={2}>
                        {metricData.map((metric) => (
                            <Grid item xs={12} sm={6} md={3} key={metric.label}>
                                <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {metric.icon}
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">{metric.label}</Typography>
                                        <Typography variant="h5" fontWeight="bold">{metric.value}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                    <Box mb={2} display="flex" justifyContent="flex-end">
                        <ButtonGroup variant="outlined" color="primary">
                            {['Hoy', '7 Días', '15 Días', '30 Días', '90 Días'].map((range) => (
                                <Button
                                    key={range}
                                    variant={selectedRange === range ? 'contained' : 'outlined'}
                                    onClick={() => handleRangeChange(range)}
                                >
                                    {range}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </Box>
                    <Grid container spacing={2} mb={4}>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    ¡Bienvenido Docente! 🎉
                                </Typography>
                                <Typography variant="body1" color="text.secondary" mb={2}>
                                    Aquí puedes ver un resumen de tu actividad reciente.
                                </Typography>
                                <Box display="flex" gap={4}>
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold">{tutorias.length}</Typography>
                                        <Typography variant="caption" color="text.secondary">Tutorías este año</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold" color="error">{new Set(tutorias.map(t => t.estudiante_id)).size}</Typography>
                                        <Typography variant="caption" color="text.secondary">Estudiantes únicos</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Tutorías Realizadas por Mes
                                </Typography>
                                {chartData.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary">Aún no tienes tutorías registradas para mostrar.</Typography>
                                ) : (
                                    <ResponsiveContainer width="100%" height={180}>
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="tutorias" fill="#1976d2" radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
            <Grid container spacing={3}>
                {menuItems.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card 
                            sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s',
                                backgroundColor: item.color,
                                color: '#fff',
                                boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    cursor: 'pointer',
                                    filter: 'brightness(1.06)'
                                }
                            }}
                            onClick={() => navigate(item.path)}
                        >
                            <CardContent sx={{ 
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                color: item.color === '#FFD600' ? '#333' : '#fff',
                                p: 2
                            }}>
                                <Box sx={{ color: item.color === '#FFD600' ? '#333' : '#fff', mb: 2 }}>
                                    {item.icon}
                                </Box>
                                <Typography variant="h6" gutterBottom sx={{ color: item.color === '#FFD600' ? '#333' : '#fff', fontWeight: 700, fontSize: 18 }}>
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: item.color === '#FFD600' ? '#333' : '#fff', opacity: 0.95, fontSize: 14 }}>
                                    {item.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default DocenteDashboard; 