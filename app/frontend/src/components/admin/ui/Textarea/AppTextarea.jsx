// src/components/admin/ui/Textarea/AppTextarea.jsx
import React from "react";
import { TextField, useTheme } from "@mui/material";

const AppTextarea = React.memo(
  ({ name, label, register, error, helperText, rows = 4, fullWidth = true, className = "", ...props }) => {
    const theme = useTheme();

    return (
      <TextField
        {...(register ? register(name) : {})}
        label={label}
        error={!!error}
        helperText={error?.message || helperText}
        multiline
        rows={rows}
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

export default AppTextarea;
