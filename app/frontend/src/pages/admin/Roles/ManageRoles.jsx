// src/pages/admin/Roles/ManageRoles.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Button,
  IconButton,
  Avatar,
  useTheme,
  Breadcrumbs,
  Link,
  Tooltip,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SecurityIcon from "@mui/icons-material/Security";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useSnackbar } from "notistack";
import DeleteConfirmationModal from "../../../components/admin/common/DeleteConfirmationModal";

// Mock data - replace with actual API calls
const mockRoles = [
  {
    id: 1,
    name: "admin",
    display_name: "Administrator",
    description: "Full system access with all permissions",
    permissions_count: 25,
    users_count: 3,
    is_system: true,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "manager",
    display_name: "Manager",
    description: "Can manage products, orders, and categories",
    permissions_count: 18,
    users_count: 5,
    is_system: false,
    created_at: "2024-01-20T14:20:00Z",
    updated_at: "2024-02-10T09:15:00Z",
  },
  {
    id: 3,
    name: "customer",
    display_name: "Customer",
    description: "Basic user with shopping capabilities",
    permissions_count: 8,
    users_count: 150,
    is_system: true,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  },
];

const ManageRoles = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  // 🔹 Fetch roles on mount
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRows(mockRoles);
      } catch (err) {
        setError("Failed to load roles. Please try again.");
        enqueueSnackbar("Error loading roles", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [enqueueSnackbar]);

  // 🔹 Map API data to DataGrid rows
  useEffect(() => {
    if (!Array.isArray(mockRoles)) return;
    const mappedRows = mockRoles.map((role, index) => ({
      id: role.id || `role-${index}`,
      name: role.name || "—",
      display_name: role.display_name || "—",
      description: role.description || "—",
      permissions_count: role.permissions_count || 0,
      users_count: role.users_count || 0,
      is_system: role.is_system || false,
      created_at: role.created_at || null,
      updated_at: role.updated_at || null,
    }));
    setRows(mappedRows);
  }, [mockRoles]);

  // 🔹 Handlers
  const handleEdit = useCallback((id) => navigate(`/admin/roles/edit/${id}`), [navigate]);
  
  const handleView = useCallback((id) => navigate(`/admin/roles/${id}`), [navigate]);

  const handleDeleteClick = useCallback((id) => {
    const role = mockRoles.find(role => role.id === id);
    setRoleToDelete({
      id,
      name: role?.display_name || 'this role'
    });
    setDeleteModalOpen(true);
  }, [mockRoles]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!roleToDelete) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      enqueueSnackbar(`Role "${roleToDelete.name}" deleted successfully`, { 
        variant: "success" 
      });
      
      // Refresh the roles list
      setRows(prev => prev.filter(role => role.id !== roleToDelete.id));
    } catch (error) {
      enqueueSnackbar(
        error || `Failed to delete role "${roleToDelete.name}"`, 
        { variant: "error" }
      );
    } finally {
      setDeleteModalOpen(false);
      setRoleToDelete(null);
    }
  }, [roleToDelete, enqueueSnackbar]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModalOpen(false);
    setRoleToDelete(null);
  }, []);

  // 🔹 Columns configuration with useMemo for performance
  const columns = useMemo(
    () => [
      {
        field: "display_name",
        headerName: "Role",
        flex: 2,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: params.row.is_system 
                  ? theme.palette.primary.main 
                  : theme.palette.secondary.main,
              }}
            >
              <SecurityIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {params.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {params.row.name}
              </Typography>
            </Box>
          </Box>
        )
      },
      { 
        field: "description", 
        headerName: "Description", 
        flex: 3,
        renderCell: (params) => (
          <Typography variant="body2" color="text.secondary">
            {params.value}
          </Typography>
        )
      },
      {
        field: "permissions_count",
        headerName: "Permissions",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={params.value}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        ),
      },
      {
        field: "users_count",
        headerName: "Users",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={params.value}
            color="secondary"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        ),
      },
      {
        field: "is_system",
        headerName: "Type",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={params.value ? "System" : "Custom"}
            color={params.value ? "primary" : "default"}
            variant={params.value ? "filled" : "outlined"}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        ),
      },
      {
        field: "updated_at",
        headerName: "Last Updated",
        flex: 1.5,
        valueGetter: (params) =>
          params?.row?.updated_at
            ? new Date(params.row.updated_at).toLocaleDateString()
            : "—",
        renderCell: (params) => (
          <Typography variant="body2" color="text.secondary">
            {params.value}
          </Typography>
        )
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 2,
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Box className="flex gap-1 justify-center">
            <Tooltip title="View Role Details">
              <IconButton 
                color="info" 
                size="small" 
                onClick={() => handleView(params.row.id)}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: theme.palette.info.light,
                    color: 'white'
                  } 
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Edit Role">
              <IconButton 
                color="success" 
                size="small" 
                onClick={() => handleEdit(params.row.id)}
                disabled={params.row.is_system}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: params.row.is_system ? 'transparent' : theme.palette.success.light,
                    color: params.row.is_system ? 'inherit' : 'white'
                  },
                  opacity: params.row.is_system ? 0.5 : 1
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={params.row.is_system ? "System roles cannot be deleted" : "Delete Role"}>
              <span>
                <IconButton 
                  color="error" 
                  size="small" 
                  onClick={() => handleDeleteClick(params.row.id)}
                  disabled={params.row.is_system}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: params.row.is_system ? 'transparent' : theme.palette.error.light,
                      color: params.row.is_system ? 'inherit' : 'white'
                    },
                    opacity: params.row.is_system ? 0.5 : 1
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [theme.palette.mode, handleEdit, handleDeleteClick, handleView, theme.palette]
  );

  return (
    <Box component="main" sx={{ p: { xs: 2, md: 3 }, maxWidth: '100%', overflow: 'hidden' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/admin" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Typography color="text.primary">Roles & Permissions</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-start", 
        mb: 4, 
        flexWrap: "wrap", 
        gap: 2 
      }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color={theme.palette.text.primary} gutterBottom>
            Roles & Permissions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage user roles and their permissions across the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/roles/create")}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1
          }}
        >
          Create New Role
        </Button>
      </Box>

      {/* Info Alert */}
      <Alert 
        severity="info" 
        sx={{ 
          mb: 3, 
          borderRadius: 2,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <Typography variant="body2" fontWeight={500}>
          System roles cannot be modified or deleted. You can create custom roles with specific permissions.
        </Typography>
      </Alert>

      {/* Data Table */}
      <Paper
        sx={{
          width: "100%",
          p: 3,
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : rows.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <SecurityIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No roles found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get started by creating your first custom role
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => navigate("/admin/roles/create")}
              startIcon={<AddIcon />}
            >
              Create First Role
            </Button>
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 25, 50]}
            initialState={{ 
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: { sortModel: [{ field: 'is_system', sort: 'desc' }, { field: 'updated_at', sort: 'desc' }] }
            }}
            autoHeight
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-cell": { 
                outline: "none !important",
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                borderBottom: `2px solid ${theme.palette.divider}`,
                fontSize: 14,
                fontWeight: 600,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: `1px solid ${theme.palette.divider}`,
              },
              border: "none",
              fontSize: 14,
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                outline: 'none !important',
              },
            }}
          />
        )}
      </Paper>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        handleClose={handleDeleteCancel}
        handleDeleteConfirm={handleDeleteConfirm}
        title="Delete Role"
        message={`Are you sure you want to delete "${roleToDelete?.name}"? This action will affect ${roleToDelete?.users_count || 0} users and cannot be undone.`}
      />
    </Box>
  );
};

export default ManageRoles;