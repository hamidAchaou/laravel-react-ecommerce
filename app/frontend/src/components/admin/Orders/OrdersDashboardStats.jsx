// src/pages/admin/Orders/components/OrdersDashboardStats.jsx
import React from "react";
import { Box, Paper, Typography, Stack } from "@mui/material";

export default function OrdersDashboardStats({ stats }) {
  // stats should be an object like:
  // { total: 120, pending: 30, completed: 80, cancelled: 10 }

  if (!stats) {
    return <Typography>Loading stats...</Typography>;
  }

  const statItems = [
    { label: "Total Orders", value: stats.total || 0 },
    { label: "Pending", value: stats.pending || 0 },
    { label: "Completed", value: stats.completed || 0 },
    { label: "Cancelled", value: stats.cancelled || 0 },
  ];

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap" }}>
      {statItems.map((item, index) => (
        <Paper
          key={index}
          elevation={3}
          sx={{
            p: 2,
            width: "200px",
            textAlign: "center",
            borderRadius: "12px",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {item.value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.label}
          </Typography>
        </Paper>
      ))}
    </Stack>
  );
}
