// src/pages/admin/Permissions/ManagePermissions.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  useTheme,
  alpha,
  Card,
  Stack,
  Snackbar,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Security,
  Lock,
  AdminPanelSettings,
  Category
} from "@mui/icons-material";
import { fetchPermissions, deletePermission } from "../../../features/permissions/permissionsThunks";
import DataTableToolbar from "../../../components/admin/DataTable/DataTableToolbar";
import DataTable from "../../../components/admin/DataTable/DataTable";
import DeleteConfirmationModal from "../../../components/admin/common/DeleteConfirmationModal";

// Helper functions for permission data
const formatPermissionName = (permissionName) => {
  if (!permissionName) return "—";
  return permissionName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getPermissionCategory = (permissionName) => {
  if (!permissionName) return 'other';
  
  const categories = {
    'view': 'read',
    'create': 'write', 
    'edit': 'write',
    'update': 'write',
    'delete': 'delete',
    'manage': 'admin',
    'admin': 'admin'
  };
  
  const prefix = permissionName.split('_')[0];
  return categories[prefix] || 'other';
};

const getPermissionScope = (permissionName) => {
  if (!permissionName) return 'general';
  
  const scopes = {
    'user': 'users',
    'role': 'roles',
    'permission': 'permissions',
    'product': 'products',
    'order': 'orders',
    'category': 'categories',
    'content': 'content',
    'setting': 'settings'
  };
  
  for (const [key, scope] of Object.entries(scopes)) {
    if (permissionName.includes(key)) return scope;
  }
  
  return 'general';
};

export default function ManagePermissions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { items: permissions, loading, error } = useSelector((state) => state.permissions);

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [loadingExport, setLoadingExport] = useState(false);

  // ✅ Fetch permissions on mount
  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  // ✅ Enhanced Table Columns with modern design
  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Permission",
        flex: 2,
        minWidth: 250,
        renderCell: (params) => (
          <Box>
            <Typography variant="body1" fontWeight={600} color="text.primary">
              {formatPermissionName(params.value) || "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {params.row.id || "N/A"}
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              {params.value} {/* Show actual permission name */}
            </Typography>
          </Box>
        ),
      },
      {
        field: "category",
        headerName: "Category",
        flex: 1,
        minWidth: 120,
        renderCell: (params) => (
          <Chip
            label={params.value ? params.value.charAt(0).toUpperCase() + params.value.slice(1) : "Other"}
            color={
              params.value === "read" ? "info" : 
              params.value === "write" ? "warning" : 
              params.value === "delete" ? "error" : 
              params.value === "admin" ? "secondary" : "default"
            }
            size="small"
            sx={{ 
              fontWeight: 600,
              borderRadius: 1.5,
              bgcolor: (theme) => {
                if (params.value === "read") return alpha(theme.palette.info.main, 0.1);
                if (params.value === "write") return alpha(theme.palette.warning.main, 0.1);
                if (params.value === "delete") return alpha(theme.palette.error.main, 0.1);
                if (params.value === "admin") return alpha(theme.palette.secondary.main, 0.1);
                return alpha(theme.palette.primary.main, 0.1);
              },
              border: (theme) => {
                if (params.value === "read") return `1px solid ${alpha(theme.palette.info.main, 0.2)}`;
                if (params.value === "write") return `1px solid ${alpha(theme.palette.warning.main, 0.2)}`;
                if (params.value === "delete") return `1px solid ${alpha(theme.palette.error.main, 0.2)}`;
                if (params.value === "admin") return `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`;
                return `1px solid ${alpha(theme.palette.primary.main, 0.2)}`;
              },
            }}
          />
        ),
      },
      {
        field: "scope",
        headerName: "Scope",
        flex: 1,
        minWidth: 120,
        renderCell: (params) => (
          <Chip
            label={params.value ? params.value.charAt(0).toUpperCase() + params.value.slice(1) : "General"}
            variant="outlined"
            size="small"
            sx={{ 
              fontWeight: 500,
              borderRadius: 1.5,
            }}
          />
        ),
      },
      {
        field: "rolesCount",
        headerName: "Roles",
        flex: 1,
        minWidth: 100,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={params.value || 0}
            size="small"
            color="primary"
            variant="filled"
            sx={{ 
              fontWeight: 600,
              minWidth: 40
            }}
          />
        ),
      },
      {
        field: "guard_name",
        headerName: "Guard",
        flex: 1,
        minWidth: 100,
        renderCell: (params) => (
          <Chip
            label={params.value || "web"}
            size="small"
            variant="outlined"
            sx={{ 
              fontWeight: 500,
              borderRadius: 1.5,
            }}
          />
        ),
      },
      {
        field: "created_at",
        headerName: "Created",
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

  // ✅ Prepare rows data for Spatie permissions
  const rows = useMemo(() => {
    if (!Array.isArray(permissions)) return [];
    return permissions.map((permission) => ({
      id: permission.id,
      name: permission.name,
      displayName: formatPermissionName(permission.name),
      category: getPermissionCategory(permission.name),
      scope: getPermissionScope(permission.name),
      guard_name: permission.guard_name || 'web',
      rolesCount: permission.roles?.length || 0,
      created_at: permission.created_at,
      isSystem: ['view_admin', 'manage_users', 'manage_roles'].includes(permission.name),
    }));
  }, [permissions]);

  // ✅ Filter by search term
  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter(
      (permission) =>
        permission.name?.toLowerCase().includes(term) ||
        permission.displayName?.toLowerCase().includes(term) ||
        permission.category?.toLowerCase().includes(term) ||
        permission.scope?.toLowerCase().includes(term)
    );
  }, [rows, searchTerm]);

  // ✅ Action handlers for DataTable
  const handleView = useCallback((row) => {
    navigate(`/admin/permissions/${row.id}`);
  }, [navigate]);

  const handleEdit = useCallback((row) => {
    if (row.isSystem) {
      setAlert({
        open: true,
        message: "System permissions cannot be edited",
        severity: "warning",
      });
      return;
    }
    navigate(`/admin/permissions/edit/${row.id}`);
  }, [navigate]);

  const handleDelete = useCallback((row) => {
    if (row.isSystem) {
      setAlert({
        open: true,
        message: "System permissions cannot be deleted",
        severity: "warning",
      });
      return;
    }
    setDeleteTarget(row);
  }, []);

  const handleAddPermission = useCallback(
    () => navigate("/admin/permissions/create"),
    [navigate]
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deletePermission(deleteTarget.id)).unwrap();
      setAlert({ 
        open: true, 
        message: "Permission deleted successfully", 
        severity: "success" 
      });
      // Refresh the permissions list
      dispatch(fetchPermissions());
    } catch (err) {
      setAlert({
        open: true,
        message: err || "Failed to delete permission",
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
      
      if (!permissions.length) {
        setAlert({
          open: true,
          message: "No permissions to export",
          severity: "warning",
        });
        return;
      }

      const headers = ["ID", "Name", "Display Name", "Category", "Scope", "Guard Name", "Roles Count", "Created At"];
      const csvRows = rows.map(
        (permission) =>
          `${permission.id},"${permission.name?.replace(/"/g, '""') || ''}","${permission.displayName || ''}","${permission.category || ''}","${permission.scope || ''}","${permission.guard_name || 'web'}",${
            permission.rolesCount || 0
          },"${permission.created_at || ""}"`
      );

      const csvString = [headers.join(","), ...csvRows].join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `permissions_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      setAlert({
        open: true,
        message: "Permissions exported successfully",
        severity: "success",
      });
    } catch (err) {
      setAlert({
        open: true,
        message: "Failed to export permissions",
        severity: "error",
      });
    } finally {
      setLoadingExport(false);
    }
  }, [permissions, rows]);

  const handleCloseAlert = () => setAlert((prev) => ({ ...prev, open: false }));

  // ✅ Stats calculation
  const stats = useMemo(() => ({
    total: permissions.length,
    filtered: filteredRows.length,
    readPermissions: rows.filter(permission => permission.category === 'read').length,
    writePermissions: rows.filter(permission => permission.category === 'write').length,
    deletePermissions: rows.filter(permission => permission.category === 'delete').length,
    adminPermissions: rows.filter(permission => permission.category === 'admin').length,
    totalRoles: rows.reduce((sum, permission) => sum + (permission.rolesCount || 0), 0),
  }), [permissions, filteredRows, rows]);

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
          Loading permissions...
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
          Error Loading Permissions
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
            Permissions Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage system permissions and access controls
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
              <Lock color="primary" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Permissions
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
              <Security color="info" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="info.main">
                  {stats.readPermissions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Read Permissions
                </Typography>
              </Box>
            </Stack>
          </Card>

          <Card sx={{ 
            p: 2.5, 
            flex: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
            borderRadius: 3,
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <AdminPanelSettings color="warning" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="warning.main">
                  {stats.writePermissions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Write Permissions
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
              <Category color="secondary" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="secondary.main">
                  {stats.totalRoles}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Role Assignments
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Stack>

        {/* Toolbar */}
        <DataTableToolbar
          title="Permissions"
          onAddClick={handleAddPermission}
          onSearchChange={setSearchTerm}
          onExportClick={handleExport}
          searchValue={searchTerm}
          searchPlaceholder="Search by permission name, category, or scope..."
          addLabel="Add Permission"
          resultCount={filteredRows.length}
          totalCount={permissions.length}
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
            loading={loading}
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
        title="Delete Permission"
        message={`Are you sure you want to delete "${deleteTarget?.displayName || deleteTarget?.name}"? This action cannot be undone and may affect role assignments.`}
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