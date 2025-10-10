// src/components/admin/ui/Select/AppSelect.jsx
import React from "react";
import { TextField, MenuItem, useTheme } from "@mui/material";

const AppSelect = React.memo(
  ({ name, label, options = [], register, error, helperText, variant = "outlined", fullWidth = true, className = "", ...props }) => {
    const theme = useTheme();

    return (
      <TextField
        select
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
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            "& fieldset": { borderColor: theme.palette.divider },
            "&:hover fieldset": { borderColor: theme.palette.primary.main },
          },
          "& .MuiFormHelperText-root": { color: theme.palette.text.secondary },
          "& .MuiSelect-select": { color: theme.palette.text.primary },
        }}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }
);

export default AppSelect;
