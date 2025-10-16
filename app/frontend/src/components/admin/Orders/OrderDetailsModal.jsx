import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Divider,
} from "@mui/material";

export default function OrderDetailsModal({ open, onClose, order }) {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Order Details</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography><strong>Order ID:</strong> {order.id}</Typography>
          <Typography><strong>Customer:</strong> {order.customer_name}</Typography>
          <Typography><strong>Status:</strong> {order.status}</Typography>
          <Typography><strong>Total:</strong> ${order.total}</Typography>

          <Divider />

          <Typography variant="subtitle1">Products:</Typography>
          {order.items?.length > 0 ? (
            order.items.map((item, index) => (
              <Typography key={index}>
                • {item.product_name} (x{item.quantity}) - ${item.price}
              </Typography>
            ))
          ) : (
            <Typography>No items found.</Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
