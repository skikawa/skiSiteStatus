import { createTheme } from "@mui/material/styles";
import { STATUS_COLORS } from "./constants";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      dark: "#115293",
      light: "#42a5f5",
    },
    secondary: {
      main: "#9c27b0",
    },
    error: {
      main: "#d32f2f",
    },
    warning: {
      main: "#ed6c02",
    },
    info: {
      main: "#0288d1",
    },
    success: {
      main: "#2e7d32",
    },
    background: {
      default: "#f7f7f7",
      paper: "#ffffff",
    },
    status: {
      loading: STATUS_COLORS.loading,
      normal: STATUS_COLORS.normal,
      error: STATUS_COLORS.error,
      warn: STATUS_COLORS.warn,
      unknown: STATUS_COLORS.unknown,
    },
    text: {
      primary: "rgba(0,0,0,0.87)",
      secondary: "rgba(0,0,0,0.54)",
      disabled: "rgba(0,0,0,0.38)",
    },
    divider: "rgba(0,0,0,0.08)",
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontSize: "40px", fontWeight: 700, lineHeight: 1.2 },
    h6: { fontSize: "20px", fontWeight: 700, lineHeight: 1.4, letterSpacing: "0.15px" },
    subtitle1: { fontSize: "16px", fontWeight: 400, lineHeight: 1.5, letterSpacing: "0.15px" },
    subtitle2: { fontSize: "14px", fontWeight: 700, lineHeight: 1.43, letterSpacing: "0.1px" },
    body1: { fontSize: "16px", fontWeight: 400, lineHeight: 1.5, letterSpacing: "0.5px" },
    body2: { fontSize: "14px", fontWeight: 400, lineHeight: 1.43, letterSpacing: "0.25px" },
    caption: { fontSize: "12px", fontWeight: 400, lineHeight: 1.66, letterSpacing: "0.4px" },
    overline: { fontSize: "10px", fontWeight: 400, lineHeight: 1.5, letterSpacing: "1.5px" },
  },
  spacing: 8,
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiCard: {
      defaultProps: { elevation: 1 },
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none" },
      },
    },
  },
});

export default lightTheme;