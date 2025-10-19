// src/pages/admin/Roles/Roles.jsx
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
  Group,
  AdminPanelSettings,
  PermIdentity
} from "@mui/icons-material";
import { fetchRoles, deleteRole } from "../../../features/roles/rolesThunks";
import DataTableToolbar from "../../../components/admin/DataTable/DataTableToolbar";
import DataTable from "../../../components/admin/DataTable/DataTable";
import DeleteConfirmationModal from "../../../components/admin/common/DeleteConfirmationModal";

export default function ManageRoles() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { items: roles, loading, error } = useSelector((state) => state.roles);

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [loadingExport, setLoadingExport] = useState(false);

  // ✅ Fetch roles on mount
  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  // ✅ Enhanced Table Columns with modern design
  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Role Name",
        flex: 2,
        minWidth: 200,
        renderCell: (params) => (
          <Box>
            <Typography variant="body1" fontWeight={600} color="text.primary">
              {params.value || "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {params.row.id || "N/A"}
            </Typography>
          </Box>
        ),
      },
      {
        field: "permissionsCount",
        headerName: "Permissions",
        flex: 1,
        minWidth: 130,
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
        field: "usersCount",
        headerName: "Users",
        flex: 1,
        minWidth: 100,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={params.value || 0}
            size="small"
            color="secondary"
            variant="filled"
            sx={{ 
              fontWeight: 600,
              minWidth: 40
            }}
          />
        ),
      },
      {
        field: "type",
        headerName: "Type",
        flex: 1,
        minWidth: 120,
        renderCell: (params) => (
          <Chip
            label={params.value ? params.value.charAt(0).toUpperCase() + params.value.slice(1) : "System"}
            color={
              params.value === "admin" ? "error" : 
              params.value === "moderator" ? "warning" : 
              "default"
            }
            size="small"
            sx={{ 
              fontWeight: 600,
              borderRadius: 1.5,
              bgcolor: (theme) => {
                if (params.value === "admin") return alpha(theme.palette.error.main, 0.1);
                if (params.value === "moderator") return alpha(theme.palette.warning.main, 0.1);
                return alpha(theme.palette.primary.main, 0.1);
              },
              border: (theme) => {
                if (params.value === "admin") return `1px solid ${alpha(theme.palette.error.main, 0.2)}`;
                if (params.value === "moderator") return `1px solid ${alpha(theme.palette.warning.main, 0.2)}`;
                return `1px solid ${alpha(theme.palette.primary.main, 0.2)}`;
              },
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

  // ✅ Prepare rows data
  const rows = useMemo(() => {
    if (!Array.isArray(roles)) return [];
    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      permissionsCount: role.permissions?.length || 0,
      usersCount: role.users?.length || 0,
      type: role.type || "system",
      created_at: role.created_at,
      description: role.description,
    }));
  }, [roles]);

  // ✅ Filter by search term
  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter(
      (role) =>
        role.name?.toLowerCase().includes(term) ||
        role.type?.toLowerCase().includes(term) ||
        role.description?.toLowerCase().includes(term)
    );
  }, [rows, searchTerm]);

  // ✅ Action handlers for DataTable
  const handleView = useCallback((row) => {
    navigate(`/admin/roles/${row.id}`);
  }, [navigate]);

  const handleEdit = useCallback((row) => {
    navigate(`/admin/roles/edit/${row.id}`);
  }, [navigate]);

  const handleDelete = useCallback((row) => {
    setDeleteTarget(row);
  }, []);

  const handleAddRole = useCallback(
    () => navigate("/admin/roles/create"),
    [navigate]
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteRole(deleteTarget.id)).unwrap();
      setAlert({ 
        open: true, 
        message: "Role deleted successfully", 
        severity: "success" 
      });
      // Refresh the roles list
      dispatch(fetchRoles());
    } catch (err) {
      setAlert({
        open: true,
        message: err || "Failed to delete role",
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
      
      if (!roles.length) {
        setAlert({
          open: true,
          message: "No roles to export",
          severity: "warning",
        });
        return;
      }

      const headers = ["ID", "Name", "Type", "Permissions Count", "Users Count", "Created At"];
      const csvRows = roles.map(
        (role) =>
          `${role.id},"${role.name?.replace(/"/g, '""') || ''}","${role.type || ''}",${
            role.permissions?.length || 0
          },${role.users?.length || 0},"${role.created_at || ""}"`
      );

      const csvString = [headers.join(","), ...csvRows].join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `roles_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      setAlert({
        open: true,
        message: "Roles exported successfully",
        severity: "success",
      });
    } catch (err) {
      setAlert({
        open: true,
        message: "Failed to export roles",
        severity: "error",
      });
    } finally {
      setLoadingExport(false);
    }
  }, [roles]);

  const handleCloseAlert = () => setAlert((prev) => ({ ...prev, open: false }));

  // ✅ Stats calculation
  const stats = useMemo(() => ({
    total: roles.length,
    filtered: filteredRows.length,
    adminRoles: roles.filter(role => role.type === 'admin').length,
    customRoles: roles.filter(role => role.type === 'custom').length,
    systemRoles: roles.filter(role => role.type === 'system').length,
    totalPermissions: roles.reduce((sum, role) => sum + (role.permissions?.length || 0), 0),
    totalUsers: roles.reduce((sum, role) => sum + (role.users?.length || 0), 0),
  }), [roles, filteredRows]);

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
          Loading roles...
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
          Error Loading Roles
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
            Roles Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage user roles, permissions, and access levels
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
              <Security color="primary" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Roles
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
              <Group color="success" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="success.main">
                  {stats.totalUsers}
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
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            borderRadius: 3,
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <AdminPanelSettings color="info" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="info.main">
                  {stats.totalPermissions}
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
            background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
            borderRadius: 3,
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <PermIdentity color="warning" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="warning.main">
                  {stats.customRoles}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Custom Roles
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Stack>

        {/* Toolbar */}
        <DataTableToolbar
          title="Roles"
          onAddClick={handleAddRole}
          onSearchChange={setSearchTerm}
          onExportClick={handleExport}
          searchValue={searchTerm}
          searchPlaceholder="Search by role name, type, or description..."
          addLabel="Add Role"
          resultCount={filteredRows.length}
          totalCount={roles.length}
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
        title="Delete Role"
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
}