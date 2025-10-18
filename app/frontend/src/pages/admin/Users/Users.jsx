// src/pages/admin/Users/Users.jsx
import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Tooltip,
  IconButton,
  Avatar,
  Card,
  CardContent,
  Button,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Group,
  Person,
  AdminPanelSettings,
  Refresh,
} from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useSnackbar } from "notistack";
import { DataGrid } from "@mui/x-data-grid";

import { fetchUsers, deleteUser } from "../../../features/users/usersThunks";

import DeleteConfirmationModal from "../../../components/admin/common/DeleteConfirmationModal";
import UserStatusBadge from "../../../components/admin/Users/UserStatusBadge";
import UserRoleChip from "../../../components/admin/Users/UserRoleChip";

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const { items: users = [], status, error } = useSelector((state) => state.users);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchUsers());
    enqueueSnackbar("Refreshing users...", { variant: "info" });
  }, [dispatch, enqueueSnackbar]);

  const handleViewUser = useCallback((id) => navigate(`/admin/users/${id}`), [navigate]);
  const handleEditUser = useCallback((id) => navigate(`/admin/users/edit/${id}`), [navigate]);

  const handleDeleteClick = useCallback((user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteUser(userToDelete.id)).unwrap();
      enqueueSnackbar(`User "${userToDelete.name}" deleted successfully`, { 
        variant: "success" 
      });
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      enqueueSnackbar(error || "Failed to delete user", { variant: "error" });
    } finally {
      setIsDeleting(false);
    }
  }, [userToDelete, dispatch, enqueueSnackbar]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  }, []);

  // Columns definition
  const columns = useMemo(() => [
    {
      field: "user",
      headerName: "User",
      flex: 2,
      minWidth: 250,
      renderCell: (params) => {
        const row = params.row || {};
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={row.avatar}
              sx={{ width: 40, height: 40, bgcolor: theme.palette.primary.main }}
            >
              {row.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {row.name || "—"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.email || "—"}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    { 
      field: "phone", 
      headerName: "Phone", 
      flex: 1,
      minWidth: 130,
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
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => {
        const date = params.row?.created_at;
        if (!date) return "—";
        try {
          return new Date(date).toLocaleDateString();
        } catch {
          return "—";
        }
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const row = params.row;
        if (!row) return null;

        return (
          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
            <Tooltip title="View User">
              <IconButton 
                size="small" 
                color="info" 
                onClick={() => handleViewUser(row.id)}
              >
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit User">
              <IconButton 
                size="small" 
                color="success" 
                onClick={() => handleEditUser(row.id)}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete User">
              <IconButton 
                size="small" 
                color="error" 
                onClick={() => handleDeleteClick(row)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ], [theme.palette, handleViewUser, handleEditUser, handleDeleteClick]);

  const userStats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin').length,
  }), [users]);

  return (
    <Box component="main" sx={{ p: { xs: 2, md: 3 } }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/admin" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Typography color="text.primary">User Management</Typography>
      </Breadcrumbs>

      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-start", 
        mb: 4,
        flexWrap: "wrap",
        gap: 2,
      }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage system users, roles, and permissions
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<Refresh />} 
            onClick={handleRefresh}
            disabled={status === "loading"}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={() => navigate("/admin/users/create")}
          >
            Add New User
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Card sx={{ flex: 1, minWidth: 200, textAlign: "center" }}>
          <CardContent>
            <Group sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
            <Typography variant="h4">{userStats.total}</Typography>
            <Typography variant="body2" color="text.secondary">
              Total Users
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200, textAlign: "center" }}>
          <CardContent>
            <Person sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
            <Typography variant="h4">{userStats.active}</Typography>
            <Typography variant="body2" color="text.secondary">
              Active Users
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200, textAlign: "center" }}>
          <CardContent>
            <AdminPanelSettings sx={{ fontSize: 40, color: theme.palette.secondary.main, mb: 1 }} />
            <Typography variant="h4">{userStats.admins}</Typography>
            <Typography variant="body2" color="text.secondary">
              Administrators
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Paper sx={{ width: "100%", borderRadius: 3, overflow: "hidden", mb: 4 }}>
        {status === "loading" && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 8 }}>
            <CircularProgress />
          </Box>
        )}
        
        {status === "failed" && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="error" variant="h6" gutterBottom>
              {error || "Failed to load users"}
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleRefresh}
              sx={{ mt: 2 }}
            >
              Retry
            </Button>
          </Box>
        )}
        
        {status === "succeeded" && (
          <DataGrid
            rows={users}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            autoHeight
            disableRowSelectionOnClick
            sx={{
              border: 0,
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          />
        )}
      </Paper>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        handleClose={handleDeleteCancel}
        handleDeleteConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        itemName={userToDelete?.name}
      />
    </Box>
  );
};

export default Users;