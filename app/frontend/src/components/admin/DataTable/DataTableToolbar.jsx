// src\components\admin\DataTable\DataTableToolbar.jsx
import React, { useCallback, useMemo, useRef } from "react";
import {
  Box,
  Stack,
  Tooltip,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Add, Search, Download, FilterList } from "@mui/icons-material";
import AppButton from "../../../components/admin/ui/Button/AppButton";
import AppInput from "../../../components/admin/ui/Input/AppInput";

// Simple debounce function
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export default function DataTableToolbar({
  title = "Data Table",
  onAddClick,
  onSearchChange,
  onExportClick,
  onFilterClick,
  searchValue = "",
  searchPlaceholder = "Search...",
  addLabel = "Add New",
  hideAdd = false,
  hideExport = false,
  hideSearch = false,
  hideFilter = false,
  loadingAdd = false,
  loadingExport = false,
  filterActive = false,
  resultCount,
  totalCount,
  sx = {},
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const colors = theme.palette.mode === "light" ? theme.palette.primary : theme.palette.secondary;

  // Debounced search
  const debouncedSearch = useRef(debounce(onSearchChange, 300));

  const handleSearchChange = useCallback(
    (e) => {
      if (onSearchChange) debouncedSearch.current(e.target.value);
    },
    [onSearchChange]
  );

  const handleAddClick = useCallback(() => {
    if (!loadingAdd && onAddClick) onAddClick();
  }, [loadingAdd, onAddClick]);

  const handleExportClick = useCallback(() => {
    if (!loadingExport && onExportClick) onExportClick();
  }, [loadingExport, onExportClick]);

  const handleFilterClick = useCallback(() => {
    if (onFilterClick) onFilterClick();
  }, [onFilterClick]);

  // Styles
  const toolbarStyles = useMemo(() => ({
    mb: 2,
    p: { xs: 1.5, sm: 2 },
    borderRadius: 3,
    bgcolor: "background.paper",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: `1px solid ${theme.palette.mode === "light" ? "#F3F4F6" : "#374151"}`,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
    ...sx,
  }), [theme.palette.mode, sx]);

  const titleStyles = useMemo(() => ({
    variant: "h6",
    fontWeight: 700,
    color: "text.primary",
    fontSize: { xs: "1.1rem", sm: "1.25rem" },
    display: "flex",
    alignItems: "center",
    gap: 1,
  }), []);

  const searchInputStyles = useMemo(() => ({
    width: { xs: "100%", sm: 280 },
    mb: { xs: 1, sm: 0 },
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: theme.palette.mode === "light" ? "#F9FAFB" : "#1F2937",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: theme.palette.mode === "light" ? "#F3F4F6" : "#374151",
      },
      "&.Mui-focused": {
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0 0 0 2px ${colors.main}20`,
      },
    },
  }), [theme.palette.mode, colors.main]);

  const resultTextStyles = useMemo(() => ({
    variant: "body2",
    color: "text.secondary",
    fontSize: "0.875rem",
    whiteSpace: "nowrap",
  }), []);

  return (
    <Box sx={toolbarStyles}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
      >
        {/* Title & Results */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: 'wrap' }}>
          <Typography sx={titleStyles}>{title}</Typography>
          {(resultCount !== undefined || totalCount !== undefined) && (
            <Typography sx={resultTextStyles}>
              {resultCount !== undefined && totalCount !== undefined
                ? `${resultCount} of ${totalCount}`
                : totalCount !== undefined
                  ? `Total: ${totalCount}`
                  : `Results: ${resultCount}`}
            </Typography>
          )}
        </Box>

        {/* Actions */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems="center"
          justifyContent="flex-end"
          width={{ xs: "100%", sm: "auto" }}
        >
          {/* Search */}
          {!hideSearch && (
            <AppInput
              placeholder={searchPlaceholder}
              size="small"
              value={searchValue}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <Search fontSize="small" sx={{ mr: 1, color: "text.secondary", opacity: 0.7 }} />,
              }}
              sx={searchInputStyles}
            />
          )}

          <Stack
            direction="row"
            spacing={1}
            width={{ xs: "100%", sm: "auto" }}
            justifyContent={{ xs: "space-between", sm: "flex-end" }}
          >
            {/* Filter */}
            {!hideFilter && onFilterClick && (
              <Tooltip title="Filter data">
                <AppButton
                  variant={filterActive ? "contained" : "outlined"}
                  color={filterActive ? "primary" : "secondary"}
                  size="small"
                  startIcon={<FilterList />}
                  onClick={handleFilterClick}
                  sx={{
                    minWidth: "auto",
                    px: 2,
                    ...(filterActive && {
                      bgcolor: `${colors.main}15`,
                      borderColor: colors.main,
                      color: colors.main,
                      "&:hover": { bgcolor: `${colors.main}25` },
                    }),
                  }}
                >
                  {!isMobile && "Filter"}
                </AppButton>
              </Tooltip>
            )}

            {/* Export */}
            {!hideExport && (
              <Tooltip title="Export data to CSV">
                <AppButton
                  variant="outlined"
                  color="secondary"
                  size="small"
                  startIcon={<Download />}
                  onClick={handleExportClick}
                  loading={loadingExport}
                  disabled={loadingExport}
                  sx={{ minWidth: "auto", px: 2 }}
                >
                  {!isMobile && "Export"}
                </AppButton>
              </Tooltip>
            )}

            {/* Add */}
            {!hideAdd && (
              <Tooltip title={addLabel}>
                <AppButton
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Add />}
                  onClick={handleAddClick}
                  loading={loadingAdd}
                  disabled={loadingAdd}
                  sx={{
                    minWidth: "auto",
                    px: 2,
                    background: `linear-gradient(135deg, ${colors.main} 0%, ${colors.dark || colors.main}80 100%)`,
                    boxShadow: `0 2px 8px ${colors.main}30`,
                    "&:hover": {
                      boxShadow: `0 4px 12px ${colors.main}40`,
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  {!isMobile && addLabel}
                </AppButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

// Default Props
DataTableToolbar.defaultProps = {
  searchValue: "",
  hideAdd: false,
  hideExport: false,
  hideSearch: false,
  hideFilter: false,
  loadingAdd: false,
  loadingExport: false,
  filterActive: false,
};
