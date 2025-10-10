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

  // ✅ Fetch products once on mount (if empty)
  useEffect(() => {
    if (!products.length) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  // ✅ Columns definition (memoized)
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

  // ✅ Search Filter
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
  const handleAddProduct = useCallback(
    () => navigate("/admin/products/create"),
    [navigate]
  );

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

    const headers = ["ID", "Title", "Price", "Category"];
    const csvRows = products.map(
      (p) =>
        `${p.id},"${p.title.replace(/"/g, '""')}",${p.price},"${
          p.category?.name || ""
        }"`
    );

    const csvString = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "products_export.csv";
    link.click();
    URL.revokeObjectURL(url);
  }, [products]);

  // ✅ Loading & Error UI
  if (loading)
    return (
      <Box
        className="flex justify-center items-center h-[70vh] bg-white"
        sx={{ gap: 2 }}
      >
        <CircularProgress size={28} />
        <Typography variant="body1" color="text.secondary">
          Loading products...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Typography variant="h6" align="center" color="error" mt={4}>
        {error}
      </Typography>
    );

  // ✅ Main Render
  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          Products Management
        </Typography>
      </Stack>

      <DataTableToolbar
        title="Products"
        onAddClick={handleAddProduct}
        onSearchChange={setSearchTerm}
        onExportClick={handleExport}
        searchPlaceholder="Search by title or category..."
        addLabel="Add Product"
      />

      <Paper
        sx={{
          mt: 2,
          p: 1,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <DataTable
          columns={columns}
          rows={filteredRows}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Paper>

      <DeleteConfirmationModal
        open={!!deleteTarget}
        handleClose={() => setDeleteTarget(null)}
        handleDeleteConfirm={confirmDelete}
      />
    </Box>
  );
}
