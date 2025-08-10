// components/theme.ts
import { ThemeOptions } from "@mui/material/styles";

export const lightTheme: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#34e834",
      light: "#66f066",
      dark: "#26b026",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F6F6F6",
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#666666",
    },
    divider: "#e0e0e0",
  },
  typography: {
    fontFamily:
      "var(--font-ibm-plex-sans), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
    h1: {
      fontFamily: "var(--font-ibm-plex-sans)",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "var(--font-ibm-plex-sans)",
      fontWeight: 600,
    },
    h3: {
      fontFamily: "var(--font-ibm-plex-sans)",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "var(--font-ibm-plex-sans)",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "var(--font-ibm-plex-sans)",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "var(--font-ibm-plex-sans)",
      fontWeight: 600,
    },
    body1: {
      fontFamily: "var(--font-ibm-plex-sans)",
    },
    body2: {
      fontFamily: "var(--font-ibm-plex-sans)",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
  },
};

export const darkTheme: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#34e834",
      light: "#66f066",
      dark: "#26b026",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#red",
      paper: "#1a1a1a",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3",
    },
    divider: "#333333",
  },
  typography: {
    fontFamily:
      "var(--font-ibm-plex-sans), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
    h1: {
      fontFamily: "var(--font-ibm-plex-sans)",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "var(--font-ibm-plex-sans)",
      fontWeight: 600,
    },
    h3: {
      fontFamily: "var(--font-ibm-plex-sans)",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "var(--font-ibm-plex-sans)",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "var(--font-ibm-plex-sans)",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "var(--font-ibm-plex-sans)",
      fontWeight: 600,
    },
    body1: {
      fontFamily: "var(--font-ibm-plex-sans)",
    },
    body2: {
      fontFamily: "var(--font-ibm-plex-sans)",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
  },
};
