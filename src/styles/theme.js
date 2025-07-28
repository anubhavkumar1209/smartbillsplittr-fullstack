import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#8fa4f3',
      dark: '#4c63d2',
    },
    secondary: {
      main: '#f093fb',
      light: '#f5b7ff',
      dark: '#c770cc',
    },
    background: {
      default: '#f8faff',
      paper: '#ffffff',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export default theme;
