// components/theme.ts
import { ThemeOptions } from '@mui/material/styles';

export const lightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
    divider: '#e0e0e0',
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    h1: {
      fontFamily: 'var(--font-geist-sans)',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'var(--font-geist-sans)',
      fontWeight: 600,
    },
    h3: {
      fontFamily: 'var(--font-geist-sans)',
      fontWeight: 600,
    },
    h4: {
      fontFamily: 'var(--font-geist-sans)',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'var(--font-geist-sans)',
      fontWeight: 600,
    },
    h6: {
      fontFamily: 'var(--font-geist-sans)',
      fontWeight: 600,
    },
    body1: {
      fontFamily: 'var(--font-geist-sans)',
    },
    body2: {
      fontFamily: 'var(--font-geist-sans)',
    },
    // code: {
    //   fontFamily: 'var(--font-geist-mono)',
    // },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
};

export const darkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#bbdefb',
      dark: '#64b5f6',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    divider: '#333333',
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    h1: {
      fontFamily: 'var(--font-geist-sans)',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'var(--font-geist-sans)',
      fontWeight: 600,
    },
    h3: {
      fontFamily: 'var(--font-geist-sans)',
      fontWeight: 600,
    },
    h4: {
      fontFamily: 'var(--font-geist-sans)',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'var(--font-geist-sans)',
      fontWeight: 600,
    },
    h6: {
      fontFamily: 'var(--font-geist-sans)',
      fontWeight: 600,
    },
    body1: {
      fontFamily: 'var(--font-geist-sans)',
    },
    body2: {
      fontFamily: 'var(--font-geist-sans)',
    },
    // code: {
    //   fontFamily: 'var(--font-geist-mono)',
    // },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
};