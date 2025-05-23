import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Paper, ButtonGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import PeopleIcon from '@mui/icons-material/People';

const metricData = [
    { label: 'Tutorías', value: 15, icon: <SchoolIcon fontSize="large" color="primary" /> },
    { label: 'Estudiantes', value: 30, icon: <PeopleIcon fontSize="large" color="primary" /> },
    { label: 'Reportes', value: 5, icon: <AssessmentIcon fontSize="large" color="primary" /> },
    { label: 'Tareas', value: 7, icon: <AssignmentIcon fontSize="large" color="primary" /> },
];

const chartData = [
    { name: 'Ene', tutorias: 3 },
    { name: 'Feb', tutorias: 5 },
    { name: 'Mar', tutorias: 7 },
    { name: 'Abr', tutorias: 15 },
];

const DocenteDashboard = () => {
    const navigate = useNavigate();
    const [selectedRange, setSelectedRange] = useState('Hoy');
    const handleRangeChange = (range) => setSelectedRange(range);

    const menuItems = [
        {
            title: 'Mis Horarios',
            description: 'Gestiona tus horarios de tutoría y disponibilidad.',
            icon: <CalendarMonthIcon sx={{ fontSize: 40 }} />,
            path: '/docente/horarios',
            color: '#1976d2'
        },
        {
            title: 'Tutorías',
            description: 'Revisa y gestiona tus próximas sesiones de tutoría.',
            icon: <SchoolIcon sx={{ fontSize: 40 }} />,
            path: '/docente/tutorias',
            color: '#2e7d32'
        },
        {
            title: 'Reportes',
            description: 'Visualiza el rendimiento y la participación en tus tutorías.',
            icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
            path: '/docente/reportes',
            color: '#ed6c02'
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Panel de Control - Docente
            </Typography>
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
                                <Typography variant="h4" fontWeight="bold">15</Typography>
                                <Typography variant="caption" color="text.secondary">Tutorías este año</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight="bold" color="error">7</Typography>
                                <Typography variant="caption" color="text.secondary">Tutorías año pasado</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Tutorías Realizadas
                        </Typography>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="tutorias" fill="#1976d2" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {menuItems.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card 
                            sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    cursor: 'pointer'
                                }
                            }}
                            onClick={() => navigate(item.path)}
                        >
                            <CardContent sx={{ 
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center'
                            }}>
                                <Box sx={{ color: item.color, mb: 2 }}>
                                    {item.icon}
                                </Box>
                                <Typography variant="h6" gutterBottom>
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
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