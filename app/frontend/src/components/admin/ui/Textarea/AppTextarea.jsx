// src/components/ui/Textarea/AppTextarea.jsx
import React from "react";
import { TextField } from "@mui/material";

const AppTextarea = ({
  name,
  label,
  register,
  error,
  helperText,
  rows = 4,
  fullWidth = true,
  ...props
}) => {
  return (
    <TextField
      {...(register ? register(name) : {})}
      label={label}
      error={!!error}
      helperText={error?.message || helperText}
      multiline
      rows={rows}
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

export default React.memo(AppTextarea);
