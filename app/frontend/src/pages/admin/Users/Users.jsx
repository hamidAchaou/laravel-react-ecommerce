// src/pages/admin/Users/Users.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  useTheme,
  alpha,
  Card,
  Stack,
  Snackbar,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Group,
  Person,
  AdminPanelSettings,
  VerifiedUser
} from "@mui/icons-material";
import { fetchUsers, deleteUser } from "../../../features/users/usersThunks";
import DataTableToolbar from "../../../components/admin/DataTable/DataTableToolbar";
import DataTable from "../../../components/admin/DataTable/DataTable";
import DeleteConfirmationModal from "../../../components/admin/common/DeleteConfirmationModal";
import UserStatusBadge from "../../../components/admin/Users/UserStatusBadge";
import UserRoleChip from "../../../components/admin/Users/UserRoleChip";

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { items: users = [], status, error } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [loadingExport, setLoadingExport] = useState(false);

  // ✅ Fetch users on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);

  // ✅ Enhanced Table Columns with modern design
  const columns = useMemo(
    () => [
      {
        field: "avatar",
        headerName: "User",
        width: 80,
        sortable: false,
        renderCell: (params) => (
          <Avatar
            src={params.value || "/api/placeholder/60/60"}
            alt={params.row.name}
            sx={{ 
              width: 48, 
              height: 48,
              bgcolor: theme.palette.primary.main,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {params.row.name?.charAt(0)?.toUpperCase()}
          </Avatar>
        ),
      },
      {
        field: "name",
        headerName: "User Details",
        flex: 2,
        minWidth: 220,
        renderCell: (params) => (
          <Box>
            <Typography variant="body1" fontWeight={600} color="text.primary">
              {params.value || "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.email || "—"}
            </Typography>
          </Box>
        ),
      },
      { 
        field: "phone", 
        headerName: "Phone", 
        flex: 1,
        minWidth: 130,
        renderCell: (params) => (
          <Typography variant="body2" color="text.primary">
            {params.value || "—"}
          </Typography>
        )
      },
      {
        field: "role",
        headerName: "Role",
        flex: 1,
        minWidth: 120,
        renderCell: (params) => <UserRoleChip role={params.value} />,
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        minWidth: 100,
        renderCell: (params) => <UserStatusBadge status={params.value} />,
      },
      {
        field: "created_at",
        headerName: "Joined",
        minWidth: 150,
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
    [theme]
  );

  // ✅ Filter by search term
  const filteredRows = useMemo(() => {
    if (!searchTerm) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  // ✅ Action handlers for DataTable
  const handleView = useCallback((row) => {
    navigate(`/admin/users/${row.id}`);
  }, [navigate]);

  const handleEdit = useCallback((row) => {
    navigate(`/admin/users/edit/${row.id}`);
  }, [navigate]);

  const handleDelete = useCallback((row) => {
    setDeleteTarget(row);
  }, []);

  const handleAddUser = useCallback(
    () => navigate("/admin/users/create"),
    [navigate]
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteUser(deleteTarget.id)).unwrap();
      setAlert({ 
        open: true, 
        message: "User deleted successfully", 
        severity: "success" 
      });
      // Refresh the users list
      dispatch(fetchUsers());
    } catch (err) {
      setAlert({
        open: true,
        message: err || "Failed to delete user",
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
      
      if (!users.length) {
        setAlert({
          open: true,
          message: "No users to export",
          severity: "warning",
        });
        return;
      }

      const headers = ["ID", "Name", "Email", "Phone", "Role", "Status", "Created At"];
      const csvRows = users.map(
        (user) =>
          `${user.id},"${user.name?.replace(/"/g, '""') || ''}","${user.email || ''}","${
            user.phone || ""
          }","${user.role || ""}","${user.status || ""}","${user.created_at || ""}"`
      );

      const csvString = [headers.join(","), ...csvRows].join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      setAlert({
        open: true,
        message: "Users exported successfully",
        severity: "success",
      });
    } catch (err) {
      setAlert({
        open: true,
        message: "Failed to export users",
        severity: "error",
      });
    } finally {
      setLoadingExport(false);
    }
  }, [users]);

  const handleCloseAlert = () => setAlert((prev) => ({ ...prev, open: false }));

  // ✅ Stats calculation
  const stats = useMemo(() => ({
    total: users.length,
    filtered: filteredRows.length,
    active: users.filter(user => user.status === 'active').length,
    admins: users.filter(user => user.role === 'admin').length,
    customers: users.filter(user => user.role === 'customer').length,
    inactive: users.filter(user => user.status === 'inactive').length,
  }), [users, filteredRows]);

  // ✅ Enhanced DataGrid styling
  const dataGridStyles = {
    border: "none",
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      borderRadius: '12px 12px 0 0',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 700,
      color: theme.palette.text.primary,
    },
    '& .MuiDataGrid-cell': {
      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    },
    '& .MuiDataGrid-row': {
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.02),
      },
    },
    '& .MuiDataGrid-footerContainer': {
      borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      borderRadius: '0 0 12px 12px',
    },
  };

  // ✅ Loading / Error UI
  if (status === "loading") {
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
          Loading users...
        </Typography>
      </Box>
    );
  }

  if (status === "failed") {
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
          Error Loading Users
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error || "Failed to load users"}
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
            Users Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage system users, roles, and permissions
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Card sx={{ 
            p: 2.5, 
            flex: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            borderRadius: 3,
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Group color="primary" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
              </Box>
            </Stack>
          </Card>

          <Card sx={{ 
            p: 2.5, 
            flex: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
            borderRadius: 3,
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Person color="success" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="success.main">
                  {stats.active}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Users
                </Typography>
              </Box>
            </Stack>
          </Card>

          <Card sx={{ 
            p: 2.5, 
            flex: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
            borderRadius: 3,
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <AdminPanelSettings color="secondary" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="secondary.main">
                  {stats.admins}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Administrators
                </Typography>
              </Box>
            </Stack>
          </Card>

          <Card sx={{ 
            p: 2.5, 
            flex: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            borderRadius: 3,
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <VerifiedUser color="info" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="info.main">
                  {stats.customers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Customers
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Stack>

        {/* Toolbar */}
        <DataTableToolbar
          title="Users"
          onAddClick={handleAddUser}
          onSearchChange={setSearchTerm}
          onExportClick={handleExport}
          searchValue={searchTerm}
          searchPlaceholder="Search by name, email, phone, or role..."
          addLabel="Add User"
          resultCount={filteredRows.length}
          totalCount={users.length}
          loadingExport={loadingExport}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 3,
            p: 2.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        />

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
            loading={status === "loading"}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25]}
            sx={dataGridStyles}
          />
        </Paper>
      </Stack>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={!!deleteTarget}
        handleClose={() => setDeleteTarget(null)}
        handleDeleteConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
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
};

export default Users;