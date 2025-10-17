import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Button,
  IconButton,
  Avatar,
  useTheme,
  Breadcrumbs,
  Link,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { fetchCategories } from "../../../features/categories/categoriesThunks";
import { useSnackbar } from "notistack";

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const { items: categories = [], loading, error } = useSelector(
    (state) => state.categories
  );

  const [rows, setRows] = useState([]);

  // 🔹 Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // 🔹 Map API data to DataGrid rows - FIXED: use image_url instead of image
  useEffect(() => {
    if (!Array.isArray(categories)) return;
    const mappedRows = categories.map((cat, index) => ({
      id: cat.id || `row-${index}`,
      name: cat.name || "—",
      image_url: cat.image_url || null, // Use image_url instead of image
      image: cat.image || null, // Keep original for reference
      parent_name: cat.parent_id
        ? categories.find((c) => c.id === cat.parent_id)?.name || "—"
        : "—",
      type: cat.type || "—",
      created_at: cat.created_at || null,
      updated_at: cat.updated_at || null,
    }));
    setRows(mappedRows);
  }, [categories]);

  // 🔹 Handlers
  const handleEdit = useCallback((id) => navigate(`/admin/categories/edit/${id}`), [navigate]);
  const handleDelete = useCallback(
    (id) => enqueueSnackbar(`Delete action clicked for ID: ${id}`, { variant: "info" }),
    [enqueueSnackbar]
  );
  const handleView = useCallback((id) => navigate(`/admin/categories/${id}`), [navigate]);

  // 🔹 Columns configuration with useMemo for performance - FIXED: use image_url
  const columns = useMemo(
    () => [
      {
        field: "image_url", // Changed from "image" to "image_url"
        headerName: "Image",
        flex: 1,
        sortable: false,
        renderCell: (params) => (
          <Avatar
            src={params.value || "/placeholder.png"} // Now using the full URL
            alt={params.row.name}
            variant="rounded"
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.100",
            }}
          >
            {!params.value && params.row.name?.charAt(0)?.toUpperCase()}
          </Avatar>
        ),
      },
      { 
        field: "name", 
        headerName: "Category Name", 
        flex: 2,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        )
      },
      { 
        field: "parent_name", 
        headerName: "Parent Category", 
        flex: 2,
        renderCell: (params) => (
          <Typography variant="body2" color={params.value === "—" ? "text.secondary" : "text.primary"}>
            {params.value}
          </Typography>
        )
      },
      {
        field: "type",
        headerName: "Type",
        flex: 1,
        renderCell: (params) => (
          <Chip
            label={params.value ? params.value.charAt(0).toUpperCase() + params.value.slice(1) : "—"}
            color={params.value === "product" ? "primary" : params.value === "service" ? "secondary" : "default"}
            size="small"
            variant="outlined"
            sx={{ 
              fontWeight: 500,
              borderRadius: 1
            }}
          />
        ),
      },
      {
        field: "created_at",
        headerName: "Created At",
        flex: 1.3,
        valueGetter: (params) =>
          params?.row?.created_at
            ? new Date(params.row.created_at).toLocaleDateString()
            : "—",
        renderCell: (params) => (
          <Typography variant="body2" color="text.secondary">
            {params.value}
          </Typography>
        )
      },
      {
        field: "updated_at",
        headerName: "Updated At",
        flex: 1.3,
        valueGetter: (params) =>
          params?.row?.updated_at
            ? new Date(params.row.updated_at).toLocaleDateString()
            : "—",
        renderCell: (params) => (
          <Typography variant="body2" color="text.secondary">
            {params.value}
          </Typography>
        )
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1.5,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box className="flex gap-1">
            <IconButton 
              color="primary" 
              size="small" 
              onClick={() => handleView(params.row.id)}
              sx={{ 
                '&:hover': { 
                  backgroundColor: theme.palette.primary.light,
                  color: 'white'
                } 
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
            <IconButton 
              color="success" 
              size="small" 
              onClick={() => handleEdit(params.row.id)}
              sx={{ 
                '&:hover': { 
                  backgroundColor: theme.palette.success.light,
                  color: 'white'
                } 
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              color="error" 
              size="small" 
              onClick={() => handleDelete(params.row.id)}
              sx={{ 
                '&:hover': { 
                  backgroundColor: theme.palette.error.light,
                  color: 'white'
                } 
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
    ],
    [theme.palette.mode, handleEdit, handleDelete, handleView, theme.palette]
  );

  return (
    <Box component="main" sx={{ p: { xs: 2, md: 3 }, maxWidth: '100%', overflow: 'hidden' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/admin" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Typography color="text.primary">Categories</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        mb: 4, 
        flexWrap: "wrap", 
        gap: 2 
      }}>
        <Typography variant="h4" fontWeight={700} color={theme.palette.text.primary}>
          Categories Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/categories/create")}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3
          }}
        >
          Add New Category
        </Button>
      </Box>

      {/* Data Table */}
      <Paper
        sx={{
          width: "100%",
          p: 3,
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ py: 6 }}>
            Error loading categories: {error}
          </Typography>
        ) : rows.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No categories found
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => navigate("/admin/categories/create")}
              sx={{ mt: 2 }}
            >
              Create First Category
            </Button>
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 25, 50]}
            initialState={{ 
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: { sortModel: [{ field: 'updated_at', sort: 'desc' }] }
            }}
            autoHeight
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-cell": { 
                outline: "none !important",
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                borderBottom: `2px solid ${theme.palette.divider}`,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
              },
              border: "none",
              fontSize: 14,
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                outline: 'none !important',
              },
            }}
          />
        )}
      </Paper>
    </Box>
  );
};

export default Categories;