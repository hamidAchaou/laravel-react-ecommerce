// src/pages/admin/Categories/Categories.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Avatar,
  useTheme,
  alpha,
  Card,
  Stack,
  Snackbar,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Category,
  Collections,
  FolderSpecial
} from "@mui/icons-material";
import { fetchCategories, deleteCategory } from "../../../features/categories/categoriesThunks";
import DataTableToolbar from "../../../components/admin/DataTable/DataTableToolbar";
import DataTable from "../../../components/admin/DataTable/DataTable";
import DeleteConfirmationModal from "../../../components/admin/common/DeleteConfirmationModal";

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { items: categories = [], loading, error } = useSelector(
    (state) => state.categories
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [loadingExport, setLoadingExport] = useState(false);

  // ✅ Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // ✅ Prepare rows data with proper parent category names
  const rows = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      image_url: category.image_url,
      parent_name: category.parent ? category.parent.name : "None",
      parent_id: category.parent_id,
      type: category.type,
      description: category.description,
      created_at: category.created_at,
      updated_at: category.updated_at,
      // You can add product_count if available from your API
      product_count: category.products_count || 0,
    }));
  }, [categories]);

  // ✅ Enhanced Table Columns with modern design
  const columns = useMemo(
    () => [
      {
        field: "image_url",
        headerName: "Image",
        width: 80,
        sortable: false,
        renderCell: (params) => (
          <Avatar
            src={params.value || "/api/placeholder/60/60"}
            alt={params.row.name}
            variant="rounded"
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
        minWidth: 200,
        renderCell: (params) => (
          <Box>
            <Typography variant="body1" fontWeight={600} color="text.primary">
              {params.value || "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {params.row.id || "N/A"}
            </Typography>
          </Box>
        )
      },
      { 
        field: "parent_name", 
        headerName: "Parent Category", 
        flex: 1.5,
        minWidth: 150,
        renderCell: (params) => (
          <Chip
            label={params.value}
            size="small"
            variant="outlined"
            color={params.value === "None" ? "default" : "primary"}
            sx={{
              fontWeight: 500,
              borderRadius: 1.5,
              bgcolor: params.value !== "None" ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.grey[500], 0.1),
              border: params.value !== "None" ? 
                `1px solid ${alpha(theme.palette.primary.main, 0.2)}` : 
                `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
            }}
          />
        )
      },
      {
        field: "type",
        headerName: "Type",
        flex: 1,
        minWidth: 120,
        renderCell: (params) => (
          <Chip
            label={params.value ? params.value.charAt(0).toUpperCase() + params.value.slice(1) : "—"}
            color={
              params.value === "product" ? "primary" : 
              params.value === "service" ? "secondary" : 
              "default"
            }
            size="small"
            sx={{ 
              fontWeight: 600,
              borderRadius: 1.5,
              bgcolor: (theme) => {
                if (params.value === "product") return alpha(theme.palette.primary.main, 0.1);
                if (params.value === "service") return alpha(theme.palette.secondary.main, 0.1);
                return alpha(theme.palette.grey[500], 0.1);
              },
              border: (theme) => {
                if (params.value === "product") return `1px solid ${alpha(theme.palette.primary.main, 0.2)}`;
                if (params.value === "service") return `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`;
                return `1px solid ${alpha(theme.palette.grey[500], 0.2)}`;
              },
            }}
          />
        ),
      },
      {
        field: "product_count",
        headerName: "Products",
        flex: 1,
        minWidth: 100,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={params.value || 0}
            size="small"
            color="info"
            variant="filled"
            sx={{ 
              fontWeight: 600,
              minWidth: 40
            }}
          />
        ),
      },
      {
        field: "created_at",
        headerName: "Created",
        minWidth: 150,
        renderCell: (params) => (
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {params.value ? new Date(params.value).toLocaleDateString("fr-FR") : "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.value ? new Date(params.value).toLocaleTimeString("fr-FR", { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : ""}
            </Typography>
          </Box>
        ),
      },
    ],
    [theme]
  );

  // ✅ Filter by search term
  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter(
      (cat) =>
        cat.name?.toLowerCase().includes(term) ||
        cat.parent_name?.toLowerCase().includes(term) ||
        cat.type?.toLowerCase().includes(term) ||
        cat.description?.toLowerCase().includes(term)
    );
  }, [rows, searchTerm]);

  // ✅ Action handlers for DataTable
  const handleView = useCallback((row) => {
    navigate(`/admin/categories/${row.id}`);
  }, [navigate]);

  const handleEdit = useCallback((row) => {
    navigate(`/admin/categories/edit/${row.id}`);
  }, [navigate]);

  const handleDelete = useCallback((row) => {
    setDeleteTarget(row);
  }, []);

  const handleAddCategory = useCallback(
    () => navigate("/admin/categories/create"),
    [navigate]
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteCategory(deleteTarget.id)).unwrap();
      setAlert({ 
        open: true, 
        message: "Category deleted successfully", 
        severity: "success" 
      });
      // Refresh the categories list
      dispatch(fetchCategories());
    } catch (err) {
      setAlert({
        open: true,
        message: err || "Failed to delete category",
        severity: "error",
      });
    } finally {
      setDeleteTarget(null);
    }
  }, [dispatch, deleteTarget]);

  const handleExport = useCallback(async () => {
    setLoadingExport(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!rows.length) {
        setAlert({
          open: true,
          message: "No categories to export",
          severity: "warning",
        });
        return;
      }

      const headers = ["ID", "Name", "Type", "Parent Category", "Description", "Created At"];
      const csvRows = rows.map(
        (cat) =>
          `${cat.id},"${cat.name?.replace(/"/g, '""') || ''}","${cat.type || ''}","${
            cat.parent_name || "None"
          }","${cat.description?.replace(/"/g, '""') || ''}","${cat.created_at || ""}"`
      );

      const csvString = [headers.join(","), ...csvRows].join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `categories_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      setAlert({
        open: true,
        message: "Categories exported successfully",
        severity: "success",
      });
    } catch (err) {
      setAlert({
        open: true,
        message: "Failed to export categories",
        severity: "error",
      });
    } finally {
      setLoadingExport(false);
    }
  }, [rows]);

  const handleCloseAlert = () => setAlert((prev) => ({ ...prev, open: false }));

  // ✅ Stats calculation - using the actual categories data
  const stats = useMemo(() => {
    const total = categories.length;
    const parentCategories = categories.filter(cat => !cat.parent_id).length;
    const subCategories = categories.filter(cat => cat.parent_id).length;
    const productCategories = categories.filter(cat => cat.type === 'product').length;
    const serviceCategories = categories.filter(cat => cat.type === 'service').length;

    return {
      total,
      filtered: filteredRows.length,
      productCategories,
      serviceCategories,
      parentCategories,
      subCategories,
      // Calculate hierarchy depth (simplified)
      maxDepth: Math.max(...categories.map(cat => {
        let depth = 0;
        let current = cat;
        while (current.parent_id) {
          depth++;
          current = categories.find(c => c.id === current.parent_id) || {};
        }
        return depth;
      }))
    };
  }, [categories, filteredRows]);

  // ✅ Enhanced DataGrid styling
  const dataGridStyles = {
    border: "none",
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      borderRadius: '12px 12px 0 0',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 700,
      color: theme.palette.text.primary,
    },
    '& .MuiDataGrid-cell': {
      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    },
    '& .MuiDataGrid-row': {
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.02),
      },
    },
    '& .MuiDataGrid-footerContainer': {
      borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      borderRadius: '0 0 12px 12px',
    },
  };

  // ✅ Loading / Error UI
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={40} />
        <Typography variant="h6" color="text.secondary">
          Loading categories...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Card sx={{ 
        p: 4, 
        textAlign: 'center',
        bgcolor: alpha(theme.palette.error.main, 0.05),
        border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
        borderRadius: 3,
        mx: 3,
        mt: 3
      }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error Loading Categories
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Card>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
            Categories Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organize your products and services with hierarchical categories
          </Typography>
        </Box>

        {/* Enhanced Stats Cards */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Card sx={{ 
            p: 2.5, 
            flex: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            borderRadius: 3,
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Category color="primary" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Categories
                </Typography>
              </Box>
            </Stack>
          </Card>

          <Card sx={{ 
            p: 2.5, 
            flex: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
            borderRadius: 3,
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Collections color="success" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="success.main">
                  {stats.productCategories}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Product Categories
                </Typography>
              </Box>
            </Stack>
          </Card>

          <Card sx={{ 
            p: 2.5, 
            flex: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            borderRadius: 3,
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <FolderSpecial color="info" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="info.main">
                  {stats.parentCategories}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Parent Categories
                </Typography>
              </Box>
            </Stack>
          </Card>

          <Card sx={{ 
            p: 2.5, 
            flex: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
            borderRadius: 3,
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Category color="warning" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="warning.main">
                  {stats.subCategories}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sub Categories
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Stack>

        {/* Toolbar */}
        <DataTableToolbar
          title="Categories"
          onAddClick={handleAddCategory}
          onSearchChange={setSearchTerm}
          onExportClick={handleExport}
          searchValue={searchTerm}
          searchPlaceholder="Search by name, type, parent, or description..."
          addLabel="Add Category"
          resultCount={filteredRows.length}
          totalCount={categories.length}
          loadingExport={loadingExport}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 3,
            p: 2.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        />

        {/* Data Table */}
        <Paper
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: 'background.paper'
          }}
        >
          <DataTable
            columns={columns}
            rows={filteredRows}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25]}
            sx={dataGridStyles}
          />
        </Paper>
      </Stack>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={!!deleteTarget}
        handleClose={() => setDeleteTarget(null)}
        handleDeleteConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          variant="filled"
          sx={{ 
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Categories;