// src/components/admin/ui/Button/AppButton.jsx
import React from "react";
import { Button, CircularProgress } from "@mui/material";

const AppButton = ({
  children,
  variant = "contained",
  color = "primary",
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  size = "medium",
  fullWidth = false,
  ...props
}) => {
  return (  
    <Button
      variant={variant}
      color={color}
      size={size}
      startIcon={startIcon}
      endIcon={endIcon}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      {...props}
      sx={{
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 500,
        px: 2.5,
        py: 1,
        boxShadow: "none",
        transition: "all 0.2s ease-in-out",
        "&:hover": { boxShadow: "0 2px 10px rgba(0,0,0,0.1)" },
      }}
    >
      {loading ? <CircularProgress size={20} color="inherit" /> : children}
    </Button>
  );
};

export default React.memo(AppButton);
