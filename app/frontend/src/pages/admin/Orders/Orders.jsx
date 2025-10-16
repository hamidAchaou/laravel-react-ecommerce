// src/pages/admin/Orders/Orders.jsx
import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Snackbar, Alert, Button } from "@mui/material";
import { fetchOrders, deleteOrderAsync, updateOrder } from "../../../features/orders/ordersThunks";
import OrdersDashboardStats from "../../../components/admin/Orders/OrdersDashboardStats";
import OrdersTable from "../../../components/admin/Orders/OrdersTable";
import OrderDetailsModal from "../../../components/admin/Orders/OrderDetailsModal";
import DeleteConfirmationModal from "../../../components/admin/common/DeleteConfirmationModal";
import { BRAND_COLORS } from "../../../theme/colors";

export default function Orders() {
  const dispatch = useDispatch();
  const { byId, allIds, loading, error } = useSelector((state) => state.orders);

  const orders = useMemo(() => allIds.map((id) => byId[id]), [allIds, byId]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [darkMode, setDarkMode] = useState(false);

  const colors = darkMode ? BRAND_COLORS.dark : BRAND_COLORS.light;

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Statistics
  const statistics = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const completed = orders.filter((o) => o.status === "completed").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;
    const revenue = orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
    return { total, pending, completed, cancelled, revenue };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return orders.filter(
      (o) =>
        o.customer_name?.toLowerCase().includes(term) ||
        o.email?.toLowerCase().includes(term) ||
        o.status?.toLowerCase().includes(term) ||
        o.total?.toString().includes(term)
    );
  }, [orders, searchTerm]);

  const handleStatusChange = useCallback(
    async (orderId, status) => {
      try {
        await dispatch(updateOrder({ id: orderId, data: { status } })).unwrap();
        setAlert({ open: true, message: `Order marked as ${status}`, severity: "success" });
      } catch {
        setAlert({ open: true, message: "Status update failed", severity: "error" });
      }
    },
    [dispatch]
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteOrderAsync(deleteTarget.id)).unwrap();
      setAlert({ open: true, message: "Order deleted successfully", severity: "success" });
    } catch {
      setAlert({ open: true, message: "Failed to delete order", severity: "error" });
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget, dispatch]);

  if (loading && orders.length === 0) return <CircularProgress size={60} />;

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3, bgcolor: colors.background, minHeight: "100vh" }}>
      <Button onClick={() => setDarkMode(!darkMode)}>{darkMode ? "Light" : "Dark"}</Button>

      {/* Statistics */}
      <OrdersDashboardStats statistics={statistics} colors={colors} />

      {/* Orders Table */}
      <OrdersTable
        orders={filteredOrders}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onViewDetails={(order) => {
          setSelectedOrder(order);
          setDetailsModalOpen(true);
        }}
        onDelete={(order) => setDeleteTarget(order)}
        onStatusChange={handleStatusChange}
        colors={colors}
      />

      {/* Modals */}
      <OrderDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        order={selectedOrder}
        onStatusChange={(status) => handleStatusChange(selectedOrder.id, status)}
        darkMode={darkMode}
      />

      <DeleteConfirmationModal
        open={!!deleteTarget}
        handleClose={() => setDeleteTarget(null)}
        handleDeleteConfirm={handleDelete}
      />

      {/* ✅ Fixed Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // ✅ Correct syntax
      >
        <Alert severity={alert.severity || "info"}>{alert.message}</Alert>
      </Snackbar>
    </Box>
  );
}
