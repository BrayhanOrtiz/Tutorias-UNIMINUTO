import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';

const DocenteDashboard = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Panel de Control - Docente
            </Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Mis Horarios
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Gestiona tus horarios de tutoría y disponibilidad.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Próximas Tutorías
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Revisa y gestiona tus próximas sesiones de tutoría.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Estadísticas
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Visualiza el rendimiento y la participación en tus tutorías.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DocenteDashboard; 