import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchOrders, deleteOrderAsync } from "../../../features/orders/ordersThunks";
import DataTable from "../../../components/admin/DataTable/DataTable";
import DataTableToolbar from "../../../components/admin/DataTable/DataTableToolbar";
import DeleteConfirmationModal from "../../../components/admin/common/DeleteConfirmationModal";

// ✅ Fixed selector - state.orders is already the slice
const selectOrders = (state) => state.orders || { orders: [], loading: false, error: null };

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading, error } = useSelector(selectOrders);

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

  // ✅ Simplified useEffect - always fetch on mount
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Columns memoized
  const columns = useMemo(
    () => [
      {
        field: "customer_name",
        headerName: "Customer",
        flex: 1,
        minWidth: 180,
        renderCell: (params) => <Typography variant="body2">{params.value || "—"}</Typography>,
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1,
        minWidth: 200,
        renderCell: (params) => (
          <Typography variant="body2" sx={{ wordBreak: "break-all" }}>{params.value || "—"}</Typography>
        ),
      },
      {
        field: "items_count",
        headerName: "Items",
        width: 90,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => <Typography variant="body2">{params.value ?? 0}</Typography>,
      },
      {
        field: "total",
        headerName: "Total (MAD)",
        minWidth: 120,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <Typography variant="body2">{params.value != null ? `${params.value} MAD` : "—"}</Typography>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 140,
        renderCell: (params) => {
          const s = (params.value || "").toLowerCase();
          const color =
            s === "pending"
              ? "warning"
              : s === "processing"
              ? "info"
              : s === "completed"
              ? "success"
              : s === "cancelled"
              ? "default"
              : "primary";
          return (
            <Chip
              label={params.value || "—"}
              size="small"
              color={color}
              sx={{ textTransform: "capitalize", fontWeight: 600 }}
            />
          );
        },
      },
      {
        field: "created_at",
        headerName: "Created At",
        minWidth: 160,
        renderCell: (params) => {
          const date = params.value ? new Date(params.value) : null;
          return (
            <Typography variant="body2">
              {date ? date.toLocaleString("fr-FR") : "—"}
            </Typography>
          );
        },
      }
      
    ],
    []
  );

  // Filtered rows memoized
  const filteredRows = useMemo(() => {
    if (!searchTerm) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter(
      (o) =>
        String(o.id).toLowerCase().includes(term) ||
        (o.customer_name || "").toLowerCase().includes(term) ||
        (o.email || "").toLowerCase().includes(term) ||
        (o.status || "").toLowerCase().includes(term)
    );
  }, [orders, searchTerm]);

  // Handlers
  const handleView = useCallback((row) => navigate(`/admin/orders/${row.id}`), [navigate]);
  const handleEdit = useCallback((row) => navigate(`/admin/orders/edit/${row.id}`), [navigate]);
  const handleDelete = useCallback((row) => setDeleteTarget(row), []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteOrderAsync(deleteTarget.id)).unwrap();
      setAlert({ open: true, message: "Order deleted successfully", severity: "success" });
    } catch (err) {
      setAlert({ open: true, message: err || "Failed to delete order", severity: "error" });
    } finally {
      setDeleteTarget(null);
    }
  }, [dispatch, deleteTarget]);

  const handleExport = useCallback(() => {
    if (!orders.length) return;
    const headers = ["Order ID", "Customer", "Email", "Items", "Total", "Status", "Created At"];
    const rows = orders.map((o) =>
      [
        o.id,
        o.customer_name || "",
        o.email || "",
        o.items_count ?? 0,
        o.total ?? 0,
        o.status || "",
        o.created_at ? new Date(o.created_at).toLocaleString("fr-FR") : "",
      ]
    );
    const csvContent =
      [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders_export.csv";
    link.click();
    URL.revokeObjectURL(url);
  }, [orders]);

  const handleCloseAlert = () => setAlert((prev) => ({ ...prev, open: false }));

  // ✅ Added debug logging
  console.log("Redux State:", { orders, loading, error });

  // Loading / Error UI
  if (loading)
    return (
      <Box className="flex justify-center items-center h-[70vh]" sx={{ gap: 2 }}>
        <CircularProgress size={28} />
        <Typography variant="body1" color="text.secondary">Loading orders...</Typography>
      </Box>
    );

  if (error)
    return (
      <Typography variant="h6" align="center" color="error" mt={4}>{error}</Typography>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          Orders Management
        </Typography>
      </Stack>

      <DataTableToolbar
        title="Orders"
        onAddClick={() => navigate("/admin/orders/create")}
        onSearchChange={setSearchTerm}
        onExportClick={handleExport}
        searchPlaceholder="Search by id, customer, email or status..."
        addLabel="creat"
      />

      <Paper sx={{ mt: 2, p: 1, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
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