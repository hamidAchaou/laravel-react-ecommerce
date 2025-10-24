// src/pages/admin/Permissions/PermissionDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
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
  Button,
  Grid,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Security,
  Lock,
  AdminPanelSettings,
  Category,
  People,
  Edit,
  ArrowBack,
  CalendarToday,
  Visibility,
  Warning,
} from "@mui/icons-material";
import { fetchPermissionById } from "../../../features/permissions/permissionsThunks";

// Helper function to format dates using native JavaScript
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    
    // Format: "January 15, 2024 at 2:30 PM"
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

// Helper function for short date format
const formatShortDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

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

const getCategoryColor = (category) => {
  const colors = {
    read: 'info',
    write: 'warning',
    delete: 'error',
    admin: 'secondary',
    other: 'default'
  };
  return colors[category] || 'default';
};

const getScopeColor = (scope) => {
  const colors = {
    users: 'primary',
    roles: 'secondary',
    permissions: 'info',
    products: 'success',
    orders: 'warning',
    categories: 'error',
    content: 'secondary',
    settings: 'info',
    general: 'default'
  };
  return colors[scope] || 'default';
};

export default function PermissionDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { currentPermission: permission, loading, error } = useSelector((state) => state.permissions);
  const [stats, setStats] = useState({
    rolesCount: 0,
    usersCount: 0,
  });

  // ✅ Fetch permission details on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchPermissionById(id));
    }
  }, [dispatch, id]);

  // ✅ Calculate stats when permission data is available
  useEffect(() => {
    if (permission) {
      setStats({
        rolesCount: permission.roles?.length || 0,
        usersCount: calculateTotalUsers(permission.roles || []),
      });
    }
  }, [permission]);

  const calculateTotalUsers = (roles) => {
    if (!Array.isArray(roles)) return 0;
    return roles.reduce((total, role) => total + (role.users_count || 0), 0);
  };

  // ✅ Permission metadata
  const permissionMeta = useMemo(() => {
    if (!permission) return null;
    
    return {
      name: permission.name,
      displayName: formatPermissionName(permission.name),
      category: getPermissionCategory(permission.name),
      scope: getPermissionScope(permission.name),
      guardName: permission.guard_name || 'web',
      description: permission.description || 'No description provided',
      createdAt: permission.created_at,
      updatedAt: permission.updated_at,
      isSystem: ['view_admin', 'manage_users', 'manage_roles', 'manage_permissions'].includes(permission.name),
    };
  }, [permission]);

  // ✅ Handle edit navigation
  const handleEdit = () => {
    navigate(`/admin/permissions/edit/${id}`);
  };

  // ✅ Handle back navigation
  const handleBack = () => {
    navigate('/admin/permissions');
  };

  // ✅ Loading State
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
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
            Loading permission details...
          </Typography>
        </Box>
      </Box>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Card sx={{ 
          p: 4, 
          textAlign: 'center',
          bgcolor: alpha(theme.palette.error.main, 0.05),
          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
          borderRadius: 3,
        }}>
          <Typography variant="h6" color="error" gutterBottom>
            Error Loading Permission
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
          >
            Back to Permissions
          </Button>
        </Card>
      </Box>
    );
  }

  // ✅ No Permission Found
  if (!permission || !permissionMeta) {
    return (
      <Box sx={{ p: 3 }}>
        <Card sx={{ 
          p: 4, 
          textAlign: 'center',
          bgcolor: alpha(theme.palette.warning.main, 0.05),
          border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
          borderRadius: 3,
        }}>
          <Typography variant="h6" color="warning" gutterBottom>
            Permission Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            The permission you're looking for doesn't exist or has been deleted.
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
          >
            Back to Permissions
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/admin" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Link component={RouterLink} to="/admin/permissions" underline="hover" color="inherit">
          Permissions
        </Link>
        <Typography color="text.primary">Permission Details</Typography>
      </Breadcrumbs>

      {/* Header Section */}
      <Stack spacing={3}>
        {/* Header with Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
              {permissionMeta.displayName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Permission details and access information
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={permissionMeta.category.toUpperCase()}
                color={getCategoryColor(permissionMeta.category)}
                size="small"
              />
              <Chip
                label={permissionMeta.scope.toUpperCase()}
                color={getScopeColor(permissionMeta.scope)}
                variant="outlined"
                size="small"
              />
              {permissionMeta.isSystem && (
                <Chip
                  label="System Permission"
                  color="warning"
                  size="small"
                  icon={<Warning />}
                />
              )}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEdit}
              disabled={permissionMeta.isSystem}
            >
              Edit Permission
            </Button>
          </Box>
        </Box>

        {/* System Permission Warning */}
        {permissionMeta.isSystem && (
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            <Typography variant="body2" fontWeight={600}>
              System Permission
            </Typography>
            <Typography variant="body2">
              This is a system permission that is critical for application functionality. 
              Modifying or deleting system permissions may cause unexpected behavior.
            </Typography>
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 2.5,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 3,
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Security color="primary" />
                <Box>
                  <Typography variant="h4" fontWeight={700} color="primary.main">
                    {stats.rolesCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assigned Roles
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 2.5,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
              borderRadius: 3,
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <People color="success" />
                <Box>
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    {stats.usersCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Affected Users
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 2.5,
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
              borderRadius: 3,
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Lock color="info" />
                <Box>
                  <Typography variant="h4" fontWeight={700} color="info.main">
                    {permissionMeta.guardName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Guard Name
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 2.5,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
              borderRadius: 3,
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Category color="warning" />
                <Box>
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {permissionMeta.scope}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Scope
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Left Column - Basic Information */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ 
                p: 3, 
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}>
                <Typography variant="h6" fontWeight={600} color="primary.main">
                  <AdminPanelSettings sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Permission Information
                </Typography>
              </Box>
              
              <Box sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {/* Permission Name */}
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Permission Name
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {permissionMeta.name}
                    </Typography>
                  </Box>

                  {/* Display Name */}
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Display Name
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {permissionMeta.displayName}
                    </Typography>
                  </Box>

                  {/* Description */}
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      fontStyle: permissionMeta.description === 'No description provided' ? 'italic' : 'normal',
                      color: permissionMeta.description === 'No description provided' ? 'text.secondary' : 'text.primary'
                    }}>
                      {permissionMeta.description}
                    </Typography>
                  </Box>

                  <Divider />

                  {/* Timestamps */}
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      <CalendarToday sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                      Timestamps
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                          Created At
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formatDate(permissionMeta.createdAt)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                          Updated At
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formatDate(permissionMeta.updatedAt)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
              </Box>
            </Card>
          </Grid>

          {/* Right Column - Roles & Additional Info */}
          <Grid item xs={12} md={6}>
            {/* Assigned Roles */}
            <Card sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
              <Box sx={{ 
                p: 3, 
                bgcolor: alpha(theme.palette.secondary.main, 0.05),
                borderBottom: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`
              }}>
                <Typography variant="h6" fontWeight={600} color="secondary.main">
                  <People sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Assigned Roles ({stats.rolesCount})
                </Typography>
              </Box>
              
              <Box sx={{ p: 3 }}>
                {stats.rolesCount > 0 ? (
                  <List dense>
                    {permission.roles?.map((role, index) => (
                      <ListItem key={role.id} divider={index < permission.roles.length - 1}>
                        <ListItemIcon>
                          <Security color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={role.name}
                          secondary={`${role.users_count || 0} users`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Visibility sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      This permission is not assigned to any roles
                    </Typography>
                  </Box>
                )}
              </Box>
            </Card>

            {/* Technical Details */}
            <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ 
                p: 3, 
                bgcolor: alpha(theme.palette.info.main, 0.05),
                borderBottom: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
              }}>
                <Typography variant="h6" fontWeight={600} color="info.main">
                  <Lock sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Technical Details
                </Typography>
              </Box>
              
              <Box sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Guard Name
                    </Typography>
                    <Chip
                      label={permissionMeta.guardName}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Permission ID
                    </Typography>
                    <Typography variant="body2" fontFamily="monospace">
                      {permission.id}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Category & Scope
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={`Category: ${permissionMeta.category}`}
                        color={getCategoryColor(permissionMeta.category)}
                        size="small"
                      />
                      <Chip
                        label={`Scope: ${permissionMeta.scope}`}
                        color={getScopeColor(permissionMeta.scope)}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}