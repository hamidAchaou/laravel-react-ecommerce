// app\frontend\src\components\admin\Orders\OrdersTable.jsx
import React, { useMemo, useCallback, useState } from "react";
import { Stack, IconButton, Tooltip, Badge, Chip } from "@mui/material";
import { Visibility, MoreVert, CheckCircle, Cancel, HourglassEmpty, LocalShipping, Inventory } from "@mui/icons-material";
import DataTable from "../../../components/admin/DataTable/DataTable";
import DataTableToolbar from "../../../components/admin/DataTable/DataTableToolbar";

export default function OrdersTable({ orders, searchTerm, setSearchTerm, onViewDetails, onDelete, onStatusChange, colors }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionTarget, setActionTarget] = useState(null);

  const handleMenuOpen = useCallback((event, order) => {
    setAnchorEl(event.currentTarget);
    setActionTarget(order);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setActionTarget(null);
  }, []);

  const columns = useMemo(() => [
    {
      field: "customer_name",
      headerName: "Customer",
      flex: 1,
      renderCell: ({ row }) => (
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Badge badgeContent={row.items_count} color="primary">
            <Inventory />
          </Badge>
          <Stack>
            <span>{row.customer_name}</span>
            <small>{row.email}</small>
          </Stack>
        </Stack>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: ({ value }) => {
        const statusMap = {
          pending: { color: "warning", icon: <HourglassEmpty /> },
          completed: { color: "success", icon: <CheckCircle /> },
          cancelled: { color: "error", icon: <Cancel /> },
          processing: { color: "info", icon: <LocalShipping /> },
        };
        const config = statusMap[value] || { color: "default", icon: <HourglassEmpty /> };
        return <Chip label={value} color={config.color} icon={config.icon} size="small" />;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => onViewDetails(row)} color="primary">
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Actions">
            <IconButton size="small" onClick={(e) => handleMenuOpen(e, row)}>
              <MoreVert fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ], [onViewDetails]);

  return (
    <>
      <DataTableToolbar title="All Orders" onSearchChange={setSearchTerm} searchPlaceholder="Search orders..." />
      <DataTable columns={columns} rows={orders} onDelete={onDelete} />
    </>
  );
}
