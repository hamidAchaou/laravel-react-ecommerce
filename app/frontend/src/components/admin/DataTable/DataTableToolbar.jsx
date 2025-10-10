// src/components/DataTableToolbar.jsx
import React from "react";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { Add, Search, Download } from "@mui/icons-material";
import AppButton from "../ui/Button/AppButton";
import AppInput from "../ui/Input/AppInput";

export default function DataTableToolbar({
  title = "Data Table",
  onAddClick,
  onSearchChange,
  onExportClick,
  searchPlaceholder = "Search...",
  addLabel = "Add New",
  hideAdd = false,
  hideExport = false,
  loadingAdd = false,
  loadingExport = false,
}) {
  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
      >
        {/* 🔹 Title */}
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ color: "text.primary" }}
        >
          {title}
        </Typography>

        {/* 🔹 Actions Section */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems="center"
          justifyContent="flex-end"
          width="100%"
        >
          {/* 🔸 Search Input */}
          <AppInput
            placeholder={searchPlaceholder}
            size="small"
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{
              width: { xs: "100%", sm: 250 },
              mb: { xs: 1, sm: 0 },
            }}
          />

          {/* 🔸 Export Button */}
          {!hideExport && (
            <Tooltip title="Export data">
              <AppButton
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<Download />}
                onClick={onExportClick}
                loading={loadingExport}
              >
                Export
              </AppButton>
            </Tooltip>
          )}

          {/* 🔸 Add Button */}
          {!hideAdd && (
            <Tooltip title={addLabel}>
              <AppButton
                variant="contained"
                color="primary"
                size="small"
                startIcon={<Add />}
                onClick={onAddClick}
                loading={loadingAdd}
              >
                {addLabel}
              </AppButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
