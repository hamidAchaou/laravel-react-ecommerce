// src/components/admin/ui/Input/AppInput.jsx
import React from "react";
import { TextField } from "@mui/material";

const AppInput = ({
  name,
  label,
  register,
  error,
  helperText,
  variant = "outlined",
  fullWidth = true,
  ...props
}) => {
  return (
    <TextField
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
    />
  );
};

export default React.memo(AppInput);
