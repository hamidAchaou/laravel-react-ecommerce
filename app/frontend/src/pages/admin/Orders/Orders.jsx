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
  Card,
  useTheme,
  alpha,
  LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ShoppingCart,
  PendingActions,
  LocalShipping,
  CheckCircle,
  Cancel,
  AttachMoney,
  TrendingUp
} from "@mui/icons-material";
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
  const theme = useTheme();

  const { byId, allIds, loading, error } = useSelector((state) => state.orders);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [loadingExport, setLoadingExport] = useState(false);

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

  // ✅ Enhanced Stats Calculation
  const stats = useMemo(() => {
    const total = orders.length;
    const totalRevenue = orders
      .filter(order => ['paid', 'shipped', 'delivered'].includes(order.status))
      .reduce((sum, order) => sum + (order.total || 0), 0);
    
    const averageOrderValue = total > 0 ? totalRevenue / total : 0;
    
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.status?.toLowerCase() || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const pendingOrders = statusCounts.pending || 0;
    const processingOrders = statusCounts.processing || 0;
    const deliveredOrders = statusCounts.delivered || 0;
    const cancelledOrders = statusCounts.cancelled || 0;

    return {
      total,
      totalRevenue,
      averageOrderValue,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      cancelledOrders,
      statusCounts,
    };
  }, [orders]);

  // ✅ Status percentage calculation
  const statusPercentage = useMemo(() => {
    if (stats.total === 0) return {};
    return Object.keys(statusColors).reduce((acc, status) => {
      acc[status] = ((stats.statusCounts[status] || 0) / stats.total) * 100;
      return acc;
    }, {});
  }, [stats, statusColors]);

  // ✅ Columns for DataTable
  const columns = useMemo(
    () => [
      {
        field: "customer_name",
        headerName: "Client",
        flex: 1.2,
        minWidth: 160,
        renderCell: (params) => (
          <Box>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {params.value || "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.email || "—"}
            </Typography>
          </Box>
        ),
      },
      {
        field: "items_count",
        headerName: "Items",
        minWidth: 100,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={params.value || 0}
            size="small"
            color="info"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        ),
      },
      {
        field: "total",
        headerName: "Total (MAD)",
        minWidth: 140,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={700} color="primary.main">
            {params.value ? `${parseFloat(params.value).toFixed(2)} MAD` : "—"}
          </Typography>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 150,
        renderCell: (params) => (
          <Chip
            label={params.value?.charAt(0).toUpperCase() + params.value?.slice(1) || "—"}
            color={statusColors[params.value?.toLowerCase()] || "default"}
            size="small"
            sx={{ 
              textTransform: "capitalize", 
              fontWeight: 600,
              borderRadius: 1.5,
            }}
          />
        ),
      },
      {
        field: "created_at",
        headerName: "Created",
        minWidth: 170,
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
    [statusColors]
  );

  // ✅ Filter and search
  const filteredRows = useMemo(() => {
    return orders.filter((order) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        order.customer_name?.toLowerCase().includes(term) ||
        order.email?.toLowerCase().includes(term) ||
        order.order_number?.toLowerCase().includes(term) ||
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

  const handleExport = useCallback(async () => {
    setLoadingExport(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!orders.length) {
        setAlert({
          open: true,
          message: "No orders to export",
          severity: "warning",
        });
        return;
      }

      const headers = ["Order ID", "Order Number", "Client", "Email", "Items", "Total", "Status", "Created At"];
      const csvRows = orders.map(
        (order) =>
          `${order.id},"${order.order_number || ''}","${order.customer_name?.replace(/"/g, '""') || ''}","${order.email || ''}",${order.items_count || 0},${order.total || 0},"${order.status || ''}","${order.created_at || ''}"`
      );

      const csvString = [headers.join(","), ...csvRows].join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      setAlert({
        open: true,
        message: "Orders exported successfully",
        severity: "success",
      });
    } catch (err) {
      setAlert({
        open: true,
        message: "Failed to export orders",
        severity: "error",
      });
    } finally {
      setLoadingExport(false);
    }
  }, [orders]);

  const handleCloseAlert = () => setAlert((prev) => ({ ...prev, open: false }));

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
          Loading orders...
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
          Error Loading Orders
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
            Orders Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage customer orders, track status, and process fulfillment
          </Typography>
        </Box>

        {/* Enhanced Stats Cards */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          {/* Total Orders */}
          <Card sx={{ 
            p: 2.5, 
            flex: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            borderRadius: 3,
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <ShoppingCart color="primary" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Orders
                </Typography>
              </Box>
            </Stack>
          </Card>

          {/* Total Revenue */}
          <Card sx={{ 
            p: 2.5, 
            flex: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
            borderRadius: 3,
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <AttachMoney color="success" />
              <Box>
                <Typography variant="h6" fontWeight={700} color="success.main">
                  {stats.totalRevenue.toFixed(2)} MAD
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Revenue
                </Typography>
              </Box>
            </Stack>
          </Card>

          {/* Pending Orders */}
          <Card sx={{ 
            p: 2.5, 
            flex: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
            borderRadius: 3,
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <PendingActions color="warning" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="warning.main">
                  {stats.pendingOrders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
              </Box>
            </Stack>
          </Card>

          {/* Delivered Orders */}
          <Card sx={{ 
            p: 2.5, 
            flex: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
            borderRadius: 3,
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <CheckCircle color="success" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="success.main">
                  {stats.deliveredOrders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Delivered
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Stack>

        {/* Toolbar */}
        <DataTableToolbar
          title="Orders"
          onSearchChange={setSearchTerm}
          onExportClick={handleExport}
          searchValue={searchTerm}
          searchPlaceholder="Search by client, email, order number, or status..."
          addLabel="Add Order"
          resultCount={filteredRows.length}
          totalCount={orders.length}
          loadingExport={loadingExport}
          hideAdd={true}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 3,
            p: 2.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        />

        {/* Filters */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            select
            size="small"
            label="Filter by Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ width: 220 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {Object.keys(statusColors).map((status) => (
              <MenuItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <Chip 
                  label={stats.statusCounts[status] || 0} 
                  size="small" 
                  sx={{ ml: 1, height: 20 }} 
                />
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
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
      </Stack>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={!!deleteTarget}
        handleClose={() => setDeleteTarget(null)}
        handleDeleteConfirm={confirmDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order #${deleteTarget?.order_number || deleteTarget?.id}? This action cannot be undone.`}
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