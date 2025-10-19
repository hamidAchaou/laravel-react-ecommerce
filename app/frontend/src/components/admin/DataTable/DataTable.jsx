// src\components\admin\DataTable\DataTable.jsx
import React, { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Stack, IconButton, Tooltip } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";

export default function DataTable({
  columns,
  rows,
  loading = false,
  getRowId = (row) => row.id,
  pageSize = 10,
  rowsPerPageOptions = [5, 10, 20],
  onEdit,
  onDelete,
  onView,
  hideActions = false,
}) {
  // ✅ Append "Actions" column automatically
  const enhancedColumns = useMemo(() => {
    if (hideActions) return columns;
    return [
      ...columns,
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        align: "center",
        headerAlign: "center",
        width: 150,
        renderCell: (params) => (
          <Stack direction="row" spacing={1} justifyContent="center">
            {onView && (
              <Tooltip title="View Details">
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => onView(params.row)}
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onEdit && (
              <Tooltip title="Edit">
                <IconButton
                  color="secondary"
                  size="small"
                  onClick={() => onEdit(params.row)}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => onDelete(params.row)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        ),
      },
    ];
  }, [columns, onEdit, onDelete, onView, hideActions]);

  return (
    <Box
      sx={{
        borderRadius: 2,
        backgroundColor: "background.paper",
        boxShadow: 2,
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "action.hover",
          fontWeight: "bold",
        },
        "& .MuiDataGrid-cell": {
          alignItems: "center",
        },
      }}
    >
      <DataGrid
        autoHeight
        loading={loading}
        columns={enhancedColumns}
        rows={rows}
        getRowId={getRowId}
        pageSize={pageSize}
        rowsPerPageOptions={rowsPerPageOptions}
        disableSelectionOnClick
        sx={{ border: "none" }}
      />
    </Box>
  );
}
