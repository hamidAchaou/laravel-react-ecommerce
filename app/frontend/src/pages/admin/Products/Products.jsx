// src/pages/admin/Products/Products.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
  Card,
  useTheme,
  alpha,
  MenuItem,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Inventory2,
  TrendingUp,
} from "@mui/icons-material";
import {
  fetchProducts,
  deleteProduct,
} from "../../../features/products/productsThunks";
import { fetchCategories } from "../../../features/categories/categoriesThunks";
import DataTableToolbar from "../../../components/admin/DataTable/DataTableToolbar";
import DataTable from "../../../components/admin/DataTable/DataTable";
import DeleteConfirmationModal from "../../../components/admin/common/DeleteConfirmationModal";

export default function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { items: products, loading: productsLoading, error: productsError } = useSelector(
    (state) => state.products
  );

  const { items: categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [loadingExport, setLoadingExport] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");

  // ✅ Fetch products and categories on mount
  useEffect(() => {
    if (!products.length) dispatch(fetchProducts());
    if (!categories.length) dispatch(fetchCategories());
  }, [dispatch, products.length, categories.length]);

  // ✅ Category colors for chips
  const getCategoryColor = (categoryName) => {
    const colors = {
      "Textiles & Weaving": "primary",
      "Leatherwork": "secondary", 
      "Woodwork": "success",
      "Metalwork": "warning",
      "Pottery & Ceramics": "info",
      "Jewelry & Accessories": "secondary",
      "Traditional Clothing": "primary",
      "default": "info"
    };
    return colors[categoryName] || colors.default;
  };

  // ✅ Stock status color
  const getStockColor = (stock) => {
    if (stock === 0) return "error";
    if (stock <= 10) return "warning";
    return "success";
  };

  // ✅ Stock status text
  const getStockText = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";
    return "In Stock";
  };

  // ✅ Enhanced Table Columns with modern design
  const columns = useMemo(
    () => [
      {
        field: "image",
        headerName: "Image",
        width: 90,
        sortable: false,
        renderCell: (params) => (
          <Avatar
            src={params.row?.images?.[0]?.image_path || "/api/placeholder/60/60"}
            alt={params.row?.title || "Product"}
            variant="rounded"
            sx={{ 
              width: 56, 
              height: 56,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
        ),
      },
      {
        field: "title",
        headerName: "Product",
        flex: 1.5,
        minWidth: 220,
        renderCell: (params) => (
          <Box>
            <Typography variant="body1" fontWeight={600} color="text.primary">
              {params.value || "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              SKU: {params.row.sku || "N/A"}
            </Typography>
          </Box>
        ),
      },
      {
        field: "price",
        headerName: "Price (MAD)",
        minWidth: 130,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <Box textAlign="right">
            <Typography variant="body1" fontWeight={700} color="primary.main">
              {params.value ? `${parseFloat(params.value).toFixed(2)} MAD` : "—"}
            </Typography>
          </Box>
        ),
      },
      {
        field: "stock",
        headerName: "Stock",
        minWidth: 120,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Box textAlign="center">
            <Chip
              label={params.value || 0}
              size="small"
              color={getStockColor(params.value)}
              variant="filled"
              sx={{ 
                fontWeight: 600,
                minWidth: 50,
                mb: 0.5
              }}
            />
            <Typography variant="caption" color="text.secondary" display="block">
              {getStockText(params.value)}
            </Typography>
          </Box>
        ),
      },
      {
        field: "category",
        headerName: "Category",
        flex: 1,
        minWidth: 160,
        renderCell: (params) =>
          params.value ? (
            <Chip
              label={params.value.name}
              color={getCategoryColor(params.value.name)}
              size="small"
              sx={{
                textTransform: "capitalize",
                fontWeight: 600,
                borderRadius: 1.5,
                bgcolor: (theme) => alpha(theme.palette[getCategoryColor(params.value.name)].main, 0.1),
                border: (theme) => `1px solid ${alpha(theme.palette[getCategoryColor(params.value.name)].main, 0.2)}`,
              }}
            />
          ) : (
            <Typography variant="caption" color="text.secondary">
              —
            </Typography>
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

  // ✅ Category counts for filter dropdown
  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach(product => {
      const categoryName = product.category?.name;
      if (categoryName) {
        counts[categoryName] = (counts[categoryName] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  // ✅ Get unique categories with counts
  const availableCategories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category?.name).filter(Boolean))];
    return uniqueCategories.sort().map(category => ({
      name: category,
      count: categoryCounts[category] || 0
    }));
  }, [products, categoryCounts]);

  // ✅ Advanced filtering logic
  const filteredRows = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(term) ||
          p.category?.name?.toLowerCase().includes(term) ||
          p.sku?.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(p => 
        p.category?.name === categoryFilter
      );
    }

    return filtered;
  }, [products, searchTerm, categoryFilter]);

  // ✅ Action handlers for DataTable
  const handleView = useCallback((row) => {
    navigate(`/admin/products/${row.id}`);
  }, [navigate]);

  const handleEdit = useCallback((row) => {
    navigate(`/admin/products/edit/${row.id}`);
  }, [navigate]);

  const handleDelete = useCallback((row) => {
    setDeleteTarget(row);
  }, []);

  const handleAddProduct = useCallback(
    () => navigate("/admin/products/create"),
    [navigate]
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteProduct(deleteTarget.id)).unwrap();
      setAlert({ 
        open: true, 
        message: "Product deleted successfully", 
        severity: "success" 
      });
    } catch (err) {
      setAlert({
        open: true,
        message: err || "Failed to delete product",
        severity: "error",
      });
    } finally {
      setDeleteTarget(null);
    }
  }, [dispatch, deleteTarget]);

  const handleExport = useCallback(async () => {
    setLoadingExport(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!filteredRows.length) {
        setAlert({
          open: true,
          message: "No products to export",
          severity: "warning",
        });
        return;
      }

      const headers = ["ID", "Title", "Price", "Stock", "Category", "SKU", "Created At"];
      const csvRows = filteredRows.map(
        (p) =>
          `${p.id},"${p.title?.replace(/"/g, '""') || ''}",${p.price || 0},${p.stock || 0},"${
            p.category?.name || ""
          }","${p.sku || ""}","${p.created_at || ""}"`
      );

      const csvString = [headers.join(","), ...csvRows].join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `products_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      setAlert({
        open: true,
        message: "Products exported successfully",
        severity: "success",
      });
    } catch (err) {
      setAlert({
        open: true,
        message: "Failed to export products",
        severity: "error",
      });
    } finally {
      setLoadingExport(false);
    }
  }, [filteredRows]);

  const handleCloseAlert = () => setAlert((prev) => ({ ...prev, open: false }));

  // ✅ Stats calculation
  const stats = useMemo(() => ({
    total: products.length,
    filtered: filteredRows.length,
    totalValue: products.reduce((sum, product) => sum + (product.price || 0), 0),
    averagePrice: products.length > 0 ? 
      products.reduce((sum, product) => sum + (product.price || 0), 0) / products.length : 0,
    outOfStock: products.filter(p => p.stock === 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
    inStock: products.filter(p => p.stock > 10).length,
    categoriesCount: availableCategories.length,
  }), [products, filteredRows, availableCategories]);

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
  if (productsLoading) {
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
          Loading products...
        </Typography>
      </Box>
    );
  }

  if (productsError) {
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
          Error Loading Products
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {productsError}
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
            Products Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your product catalog, inventory, and pricing
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
              <Inventory2 color="primary" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Products
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
              <TrendingUp color="success" />
              <Box>
                <Typography variant="h6" fontWeight={700} color="success.main">
                  {stats.averagePrice.toFixed(2)} MAD
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Price
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
              <Inventory2 color="warning" />
              <Box>
                <Typography variant="h6" fontWeight={700} color="warning.main">
                  {stats.lowStock}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Low Stock
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
              <Inventory2 color="info" />
              <Box>
                <Typography variant="h6" fontWeight={700} color="info.main">
                  {stats.categoriesCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Categories
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Stack>

        {/* Toolbar */}
        <DataTableToolbar
          title="Products"
          onAddClick={handleAddProduct}
          onSearchChange={setSearchTerm}
          onExportClick={handleExport}
          searchValue={searchTerm}
          searchPlaceholder="Search by title, category, or SKU..."
          addLabel="Add Product"
          resultCount={filteredRows.length}
          totalCount={products.length}
          loadingExport={loadingExport}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 3,
            p: 2.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        />

        {/* Category Filter - Similar to Orders Status Filter */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            select
            size="small"
            label="Filter by Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            sx={{ width: 280 }}
            disabled={categoriesLoading}
          >
            <MenuItem value="">
              <Typography variant="body2">All Categories</Typography>
              <Chip 
                label={stats.total} 
                size="small" 
                sx={{ ml: 1, height: 20 }} 
              />
            </MenuItem>
            {availableCategories.map((category) => (
              <MenuItem key={category.name} value={category.name}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <Typography variant="body2">{category.name}</Typography>
                  <Chip 
                    label={category.count} 
                    size="small" 
                    sx={{ ml: 1, height: 20 }} 
                  />
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </Stack>

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
            loading={productsLoading}
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
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
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
}