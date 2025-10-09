// src/theme/theme.js
import { createTheme } from "@mui/material/styles";
import { BRAND_COLORS } from "./colors";

export const getTheme = (mode = "light") => {
  const colors = mode === "light" ? BRAND_COLORS.light : BRAND_COLORS.dark;

  return createTheme({
    palette: {
      mode,
      primary: { main: colors.primary },
      secondary: { main: colors.secondary },
      background: {
        default: colors.background,
        paper: colors.surface,
      },
      text: {
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
      },
    },
    components: {
      // Optional: global component overrides for clean UI/UX
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none", // clean button labels
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: "0px 2px 10px rgba(0,0,0,0.08)",
          },
        },
      },
    },
    typography: {
      fontFamily: "'Inter', 'Roboto', sans-serif",
      h1: { fontWeight: 700 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 500 },
      body1: { fontWeight: 400 },
      button: { fontWeight: 500 },
    },
  });
};
