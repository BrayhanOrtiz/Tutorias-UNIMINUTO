import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de un NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showNotification = (message, severity = 'success', duration = 6000) => {
    console.log('Mostrando notificación:', { message, severity, duration }); // Debug log
    setSnackbar({
      open: true,
      message,
      severity,
      duration
    });
  };

  const handleClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '& .MuiAlert-root': {
            minWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            fontSize: '1rem',
            padding: '12px 20px'
          }
        }}
      >
        <Alert 
          onClose={handleClose} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            },
            '& .MuiAlert-message': {
              fontSize: '1rem',
              fontWeight: 500
            },
            '&.MuiAlert-filledSuccess': {
              backgroundColor: '#2e7d32',
              color: '#ffffff'
            },
            '&.MuiAlert-filledError': {
              backgroundColor: '#d32f2f',
              color: '#ffffff'
            },
            '&.MuiAlert-filledWarning': {
              backgroundColor: '#ed6c02',
              color: '#ffffff'
            },
            '&.MuiAlert-filledInfo': {
              backgroundColor: '#0288d1',
              color: '#ffffff'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}; 