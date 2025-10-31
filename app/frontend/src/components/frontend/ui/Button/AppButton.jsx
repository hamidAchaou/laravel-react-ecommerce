// components/ui/Button/AppButton.jsx
import React from "react";
import { Button, CircularProgress, useTheme } from "@mui/material";

const AppButton = React.forwardRef(({
  children,
  variant = "contained",
  color = "primary",
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  size = "medium",
  fullWidth = false,
  className = "",
  ...props
}, ref) => {
  const theme = useTheme();

  const buttonStyles = {
    boxShadow: "none",
    px: 2.5,
    py: 1,
    backgroundColor: variant === "contained" 
      ? theme.palette[color].main 
      : "transparent",
    color: variant === "contained"
      ? theme.palette.getContrastText(theme.palette[color].main)
      : theme.palette[color].main,
    "&:hover": {
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      backgroundColor: variant === "contained"
        ? theme.palette[color].dark
        : theme.palette.action.hover,
    },
  };

  return (
    <Button
      ref={ref}
      variant={variant}
      color={color}
      size={size}
      startIcon={startIcon}
      endIcon={endIcon}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      className={`rounded-xl font-medium capitalize transition-all duration-200 ${className}`}
      sx={buttonStyles}
      {...props}
    >
      {loading ? <CircularProgress size={20} color="inherit" /> : children}
    </Button>
  );
});

AppButton.displayName = "AppButton";

export default React.memo(AppButton);