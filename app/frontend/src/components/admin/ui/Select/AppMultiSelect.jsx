import React from "react";
import { Autocomplete, TextField, CircularProgress, useTheme } from "@mui/material";

const AppMultiSelect = React.memo(
  ({
    label,
    options = [],
    value = [],
    onChange,
    loading = false,
    error,
    helperText,
    disabled = false,
    placeholder = "Select options...",
    ...props
  }) => {
    const theme = useTheme();

    return (
      <Autocomplete
        multiple
        options={options}
        value={value}
        getOptionLabel={(option) => option.label || ""}
        isOptionEqualToValue={(option, val) => option.value === val.value}
        onChange={(_, newValue) => onChange(newValue)}
        disabled={disabled}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            error={!!error}
            helperText={error?.message || helperText}
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={20} color="inherit" /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? "#1E293B" : "#fff",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": { borderColor: theme.palette.divider },
                "&:hover fieldset": { borderColor: theme.palette.primary.main },
              },
            }}
          />
        )}
        {...props}
      />
    );
  }
);

export default AppMultiSelect;
