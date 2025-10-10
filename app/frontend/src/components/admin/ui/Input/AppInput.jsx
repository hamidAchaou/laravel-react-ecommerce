// src/components/admin/ui/Input/AppInput.jsx
import React from "react";
import { TextField, useTheme } from "@mui/material";

const AppInput = React.memo(
  ({ name, label, register, error, helperText, variant = "outlined", fullWidth = true, className = "", ...props }) => {
    const theme = useTheme();

    return (
      <TextField
        {...(register ? register(name) : {})}
        label={label}
        error={!!error}
        helperText={error?.message || helperText}
        variant={variant}
        fullWidth={fullWidth}
        {...props}
        className={className}
        sx={{
          mb: 2,
          backgroundColor: theme.palette.mode === "dark" ? "#1E293B" : "#fff",
          input: { color: theme.palette.text.primary },
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            "& fieldset": { borderColor: theme.palette.divider },
            "&:hover fieldset": { borderColor: theme.palette.primary.main },
          },
          "& .MuiFormHelperText-root": { color: theme.palette.text.secondary },
        }}
      />
    );
  }
);

export default AppInput;
