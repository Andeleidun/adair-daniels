import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0472cd',
      dark: '#035ba4',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#007a3f',
      dark: '#005f31',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f7f6',
      paper: '#ffffff',
    },
    text: {
      primary: '#17231d',
      secondary: '#4c5c54',
    },
  },
  shape: {
    borderRadius: 12,
  },
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.2, 0, 0, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: 90,
      shorter: 120,
      short: 160,
      standard: 180,
      complex: 240,
      enteringScreen: 160,
      leavingScreen: 120,
    },
  },
  typography: {
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body1: {
      lineHeight: 1.65,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #dbe5df',
          boxShadow: '0 12px 30px rgba(22, 54, 39, 0.08)',
        },
      },
    },
  },
});

export default theme;
