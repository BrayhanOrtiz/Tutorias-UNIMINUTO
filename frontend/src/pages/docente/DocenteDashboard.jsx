import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';

const DocenteDashboard = () => {
    const navigate = useNavigate();

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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Panel de Control - Docente
            </Typography>
            
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
        </Container>
    );
};

export default DocenteDashboard; 