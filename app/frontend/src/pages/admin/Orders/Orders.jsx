// src/pages/admin/Orders/Orders.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
  MenuItem,
  TextField,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchOrders,
  deleteOrderAsync,
} from "../../../features/orders/ordersThunks";
import DataTable from "../../../components/admin/DataTable/DataTable";
import DataTableToolbar from "../../../components/admin/DataTable/DataTableToolbar";
import DeleteConfirmationModal from "../../../components/admin/common/DeleteConfirmationModal";

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { byId, allIds, loading, error } = useSelector((state) => state.orders);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

  const orders = useMemo(() => allIds.map((id) => byId[id]), [allIds, byId]);

  // ✅ Fetch orders once on mount
  useEffect(() => {
    if (!allIds.length) dispatch(fetchOrders());
  }, [dispatch, allIds.length]);

  // ✅ Status color mapping
  const statusColors = {
    pending: "warning",
    processing: "info",
    paid: "success",
    shipped: "primary",
    delivered: "success",
    cancelled: "error",
    refunded: "secondary",
  };

  // ✅ Columns for DataTable
  const columns = useMemo(
    () => [
      {
        field: "customer_name",
        headerName: "Client",
        flex: 1,
        minWidth: 160,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={500}>
            {params.value || "—"}
          </Typography>
        ),
      },
      {
        field: "items_count",
        headerName: "Items",
        minWidth: 100,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "total",
        headerName: "Total (MAD)",
        minWidth: 140,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={500}>
            {params.value ? `${params.value.toFixed(2)} MAD` : "—"}
          </Typography>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 150,
        renderCell: (params) => (
          <Chip
            label={params.value}
            color={statusColors[params.value?.toLowerCase()] || "default"}
            size="small"
            sx={{ textTransform: "capitalize", fontWeight: 500 }}
          />
        ),
      },
      {
        field: "created_at",
        headerName: "Created At",
        minWidth: 170,
        valueGetter: (params) =>
          params.value
            ? new Date(params.value).toLocaleString("fr-FR")
            : "—",
      },
    ],
    []
  );

  // ✅ Filter and search
  const filteredRows = useMemo(() => {
    return orders.filter((order) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        order.customer_name?.toLowerCase().includes(term) ||
        order.status?.toLowerCase().includes(term);
      const matchesStatus =
        !statusFilter || order.status?.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // ✅ Handlers
  const handleView = useCallback(
    (row) => navigate(`/admin/orders/${row.id}`),
    [navigate]
  );

  const handleEdit = useCallback(
    (row) => navigate(`/admin/orders/edit/${row.id}`),
    [navigate]
  );

  const handleDelete = useCallback((row) => setDeleteTarget(row), []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteOrderAsync(deleteTarget.id)).unwrap();
      setAlert({
        open: true,
        message: "Order deleted successfully",
        severity: "success",
      });
    } catch (err) {
      setAlert({
        open: true,
        message: err || "Failed to delete order",
        severity: "error",
      });
    } finally {
      setDeleteTarget(null);
    }
  }, [dispatch, deleteTarget]);

  const handleExport = useCallback(() => {
    if (!orders.length) return;

    const headers = ["ID", "Client", "Email", "Items", "Total", "Status"];
    const csvRows = orders.map(
      (o) =>
        `${o.id},"${o.customer_name}","${o.email}",${o.items_count},${o.total},"${o.status}"`
    );
    const csvString = [headers.join(","), ...csvRows].join("\n");

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders_export.csv";
    link.click();
    URL.revokeObjectURL(url);
  }, [orders]);

  const handleCloseAlert = () => setAlert((prev) => ({ ...prev, open: false }));

  // ✅ Loading / Error UI
  if (loading)
    return (
      <Box
        className="flex justify-center items-center h-[70vh]"
        sx={{ gap: 2 }}
      >
        <CircularProgress size={28} />
        <Typography variant="body1" color="text.secondary">
          Loading orders...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Typography variant="h6" align="center" color="error" mt={4}>
        {error}
      </Typography>
    );

  // ✅ Render UI
  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h4" fontWeight={700} color="text.primary">
          Orders Management
        </Typography>
      </Stack>

      {/* Toolbar */}
      <DataTableToolbar
        title="Orders"
        onSearchChange={setSearchTerm}
        onExportClick={handleExport}
        searchPlaceholder="Search by client or status..."
        hideAddButton
      />

      {/* Filters */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
        <TextField
          select
          size="small"
          label="Filter by Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: 220 }}
        >
          <MenuItem value="">All</MenuItem>
          {Object.keys(statusColors).map((status) => (
            <MenuItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* Table */}
      <Paper
        sx={{
          mt: 1,
          p: 1,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <DataTable
          columns={columns}
          rows={filteredRows}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Paper>

      {/* Delete Modal */}
      <DeleteConfirmationModal
        open={!!deleteTarget}
        handleClose={() => setDeleteTarget(null)}
        handleDeleteConfirm={confirmDelete}
      />

      {/* Snackbar Alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
