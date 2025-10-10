// src/components/ui/Select/AppSelect.jsx
import React from "react";
import { TextField, MenuItem } from "@mui/material";

const AppSelect = ({
  name,
  label,
  options = [],
  register,
  error,
  helperText,
  variant = "outlined",
  fullWidth = true,
  ...props
}) => {
  return (
    <TextField
      select
      {...(register ? register(name) : {})}
      label={label}
      error={!!error}
      helperText={error?.message || helperText}
      variant={variant}
      fullWidth={fullWidth}
      sx={{
        mb: 2,
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
        },
      }}
      {...props}
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default React.memo(AppSelect);
