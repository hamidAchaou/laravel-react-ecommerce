import React, { createContext, useMemo, useState, useContext, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "../theme/theme";

// Create a context
const ColorModeContext = createContext({
  mode: "light",
  toggleColorMode: () => {},
});

// Custom hook for easy use
export const useColorMode = () => useContext(ColorModeContext);

// Provider component
export const ColorModeProvider = ({ children }) => {
  // Optional: persist mode in localStorage
  const storedMode = localStorage.getItem("colorMode") || "light";
  const [mode, setMode] = useState(storedMode);

  const toggleColorMode = () => {
    setMode((prev) => {
      const nextMode = prev === "light" ? "dark" : "light";
      localStorage.setItem("colorMode", nextMode);
      return nextMode;
    });
  };

  // Memoize theme for performance
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
