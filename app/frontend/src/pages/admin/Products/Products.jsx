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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  fetchProducts,
  deleteProduct,
} from "../../../features/products/productsThunks";
import DataTable from "../../../components/admin/DataTable/DataTable";
import DataTableToolbar from "../../../components/admin/DataTable/DataTableToolbar";
import DeleteConfirmationModal from "../../../components/admin/common/DeleteConfirmationModal";

export default function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: products, loading, error } = useSelector(
    (state) => state.products
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ✅ Fetch products once on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ✅ Columns definition with memoization
  const columns = useMemo(
    () => [
      {
        field: "image",
        headerName: "Image",
        width: 80,
        sortable: false,
        renderCell: (params) => (
          <Avatar
            src={params.row?.images?.[0]?.image_path || "/placeholder.png"}
            alt={params.row?.title || "Product"}
            variant="rounded"
            sx={{ width: 48, height: 48 }}
          />
        ),
      },
      {
        field: "title",
        headerName: "Title",
        flex: 1,
        minWidth: 180,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={500}>
            {params.value || "—"}
          </Typography>
        ),
      },
      {
        field: "price",
        headerName: "Price (MAD)",
        minWidth: 120,
        type: "number",
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <Typography variant="body2">
            {params.value ? `${params.value} MAD` : "—"}
          </Typography>
        ),
      },
      {
        field: "category",
        headerName: "Category",
        flex: 1,
        minWidth: 150,
        renderCell: (params) =>
          params.value ? (
            <Chip
              label={params.value.name}
              color="primary"
              size="small"
              sx={{
                textTransform: "capitalize",
                fontWeight: 500,
                bgcolor: (theme) => theme.palette.primary.main + "20",
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
        headerName: "Created At",
        minWidth: 160,
        valueGetter: (params) =>
          params.value ? new Date(params.value).toLocaleString("fr-FR") : "—",
      },
      {
        field: "updated_at",
        headerName: "Updated At",
        minWidth: 160,
        valueGetter: (params) =>
          params.value ? new Date(params.value).toLocaleString("fr-FR") : "—",
      },
    ],
    []
  );

  // ✅ Filtered rows for search
  const filteredRows = useMemo(() => {
    if (!searchTerm) return products;
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.title?.toLowerCase().includes(term) ||
        p.category?.name?.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  // ✅ Handlers
  const handleAddProduct = useCallback(() => {
    navigate("/admin/products/create");
  }, [navigate]);

  const handleView = useCallback(
    (row) => navigate(`/admin/products/${row.id}`),
    [navigate]
  );

  const handleEdit = useCallback(
    (row) => navigate(`/admin/products/edit/${row.id}`),
    [navigate]
  );

  const handleDelete = useCallback((row) => setDeleteTarget(row), []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await dispatch(deleteProduct(deleteTarget.id));
    setDeleteTarget(null);
  }, [dispatch, deleteTarget]);

  const handleExport = useCallback(() => {
    if (!products.length) return;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Title,Price,Category"]
        .concat(
          products.map(
            (p) =>
              `${p.id},"${p.title.replace(/"/g, '""')}",${p.price},"${
                p.category?.name || ""
              }"`
          )
        )
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "products_export.csv";
    link.click();
  }, [products]);

  // ✅ Loading & Error UI
  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={6}
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography variant="h6" align="center" color="error" mt={4}>
        {error}
      </Typography>
    );

  // ✅ Render
  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={2}
        component="h1"
        sx={{ color: "text.primary" }}
      >
        Products Management
      </Typography>

      {/* Toolbar */}
      <DataTableToolbar
        title="Products"
        onAddClick={handleAddProduct}
        onSearchChange={setSearchTerm}
        onExportClick={handleExport}
        searchPlaceholder="Search by title or category..."
        addLabel="Add Product"
      />

      {/* Data Table */}
      <Paper sx={{ mt: 2, p: 1 }}>
        <DataTable
          columns={columns}
          rows={filteredRows}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Paper>

      {/* Delete Confirmation */}
      <DeleteConfirmationModal
        open={!!deleteTarget}
        handleClose={() => setDeleteTarget(null)}
        handleDeleteConfirm={confirmDelete}
      />
    </Box>
  );
}
