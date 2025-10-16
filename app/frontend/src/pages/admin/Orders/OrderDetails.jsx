// src/pages/admin/Orders/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  CircularProgress,
  Button,
  Avatar,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderById } from "../../../features/orders/ordersThunks";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { loading, error } = useSelector((state) => state.orders || {});
  const [order, setOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchOrderById(id)).then((res) => {
      console.log("✅ Fetched Order:", res.payload);
      setOrder(res.payload);
    });
  }, [dispatch, id]);

  if (loading || !order) {
    return (
      <Box className="flex justify-center items-center h-[70vh]" sx={{ gap: 2 }}>
        <CircularProgress size={28} color="primary" />
        <Typography variant="body1" color="textSecondary">
          Loading order details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography
        variant="h6"
        color={theme.palette.error.main}
        align="center"
        mt={4}
      >
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/admin/orders")}
        sx={{ mb: 3 }}
        variant="contained"
        color="secondary"
      >
        Back to Orders
      </Button>

      <Typography variant="h4" component="h1" fontWeight={700} mb={2}>
        Order #{order.id} Details
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 2, mb: 3, boxShadow: 2 }}>
        <Stack spacing={1.5}>
          <Typography component="div"><strong>Customer:</strong> {order.customer_name}</Typography>
          <Typography component="div"><strong>Email:</strong> {order.email}</Typography>
          <Typography component="div"><strong>Items Count:</strong> {order.items_count}</Typography>
          <Typography component="div"><strong>Total:</strong> {order.total} MAD</Typography>
          <Typography component="div">
            <strong>Status:</strong>{" "}
            <Chip
              label={order.status}
              size="small"
              sx={{
                textTransform: "capitalize",
                fontWeight: 600,
                backgroundColor: order.status_color,
                color: "#fff",
              }}
            />
          </Typography>
          <Typography component="div">
            <strong>Created At:</strong>{" "}
            {new Date(order.created_at).toLocaleString("fr-FR")}
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h6" mb={2}>
          Items
        </Typography>

        {order.items.length ? (
          <Stack spacing={1.5}>
            {order.items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #E0E0E0",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Avatar
                  variant="rounded"
                  src={item.image ? `/storage/${item.image}` : ""}
                  alt={item.name}
                  sx={{ width: 56, height: 56, borderRadius: 1 }}
                />

                <Box sx={{ flex: 1, ml: 2 }}>
                  <Typography component="div" fontWeight={600}>{item.name}</Typography>
                  <Typography component="div" variant="body2" color="text.secondary">
                    {item.quantity} × {item.price} MAD
                  </Typography>
                </Box>

                <Typography component="div" fontWeight={600}>
                  {(item.quantity * item.price).toFixed(2)} MAD
                </Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary" component="div">No items in this order.</Typography>
        )}
      </Paper>
    </Box>
  );
}
