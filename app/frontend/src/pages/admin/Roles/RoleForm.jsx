// src/pages/admin/Roles/RoleForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  Typography,
  Alert,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
  useTheme,
  CircularProgress,
  Badge,
  Tooltip,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { createRole, updateRole, fetchRoleById } from '../../../features/roles/rolesThunks';
import { fetchPermissions } from '../../../features/permissions/permissionsThunks';

const RoleForm = ({ roleId, isEdit = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  // Redux state with safe access
  const permissionsState = useSelector((state) => state.permissions);
  const rolesState = useSelector((state) => state.roles);

  const permissions = permissionsState?.items || [];
  const permissionsLoading = permissionsState?.loading || false;
  const rolesLoading = rolesState?.loading || false;

  const [formData, setFormData] = useState({
    name: '',
    guard_name: 'web',
    permissions: [], // This will store permission IDs
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // Find permission by name (to match backend data)
  const findPermissionByName = (permissionName) => {
    return permissions.find(p => p.name === permissionName);
  };

  // Find permission ID by name
  const findPermissionIdByName = (permissionName) => {
    const permission = findPermissionByName(permissionName);
    return permission ? permission.id : null;
  };

  // Group permissions by prefix (e.g., 'view_', 'create_', 'edit_', 'delete_')
  const groupPermissions = (permissions) => {
    if (!permissions || !Array.isArray(permissions)) {
      return [];
    }
    
    const groups = {};
    
    permissions.forEach(permission => {
      if (!permission || !permission.name) return;
      
      // Extract prefix from permission name (e.g., 'view' from 'view_products')
      const parts = permission.name.split('_');
      const prefix = parts[0]; // 'view', 'create', 'edit', 'delete', etc.
      
      if (!groups[prefix]) {
        groups[prefix] = {
          category: prefix.charAt(0).toUpperCase() + prefix.slice(1),
          permissions: []
        };
      }
      
      groups[prefix].permissions.push(permission);
    });
    
    return Object.values(groups);
  };

  // Filter permissions to show only selected ones
  const getFilteredPermissionGroups = () => {
    const groups = groupPermissions(permissions);
    
    if (!showSelectedOnly) return groups;

    return groups
      .map(group => ({
        ...group,
        permissions: group.permissions.filter(permission => 
          formData.permissions.includes(permission.id)
        )
      }))
      .filter(group => group.permissions.length > 0);
  };

  // Get selected permissions count by category
  const getSelectedCountByCategory = (category) => {
    if (!category || !category.permissions) return 0;
    const categoryPermissionIds = category.permissions.map(p => p.id);
    return categoryPermissionIds.filter(id => formData.permissions.includes(id)).length;
  };

  // Get all selected permission names for display
  const getSelectedPermissionNames = () => {
    return permissions
      .filter(permission => formData.permissions.includes(permission.id))
      .map(permission => formatPermissionName(permission.name));
  };

  // Fetch permissions and role data
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Fetch permissions
        await dispatch(fetchPermissions()).unwrap();

        // Fetch role data if editing
        if (isEdit && roleId) {
          setLoading(true);
          try {
            const result = await dispatch(fetchRoleById(roleId)).unwrap();
            const role = result.data || result;
            
            console.log('Role data from backend:', role);
            console.log('Available permissions:', permissions);
            
            // Convert permission names to IDs
            const permissionIds = [];
            if (role.permissions && Array.isArray(role.permissions)) {
              role.permissions.forEach(permissionName => {
                const permissionId = findPermissionIdByName(permissionName);
                if (permissionId) {
                  permissionIds.push(permissionId);
                } else {
                  console.warn(`Permission not found: ${permissionName}`);
                }
              });
            }
            
            console.log('Converted permission IDs:', permissionIds);
            
            setFormData({
              name: role.name || '',
              guard_name: role.guard_name || 'web',
              permissions: permissionIds,
            });
          } catch (error) {
            console.error('Error loading role:', error);
            enqueueSnackbar('Error loading role data', { variant: 'error' });
          } finally {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        enqueueSnackbar('Error loading permissions', { variant: 'error' });
      }
    };

    initializeData();
  }, [isEdit, roleId, dispatch, enqueueSnackbar]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handlePermissionChange = (permissionId) => (event) => {
    const { checked } = event.target;
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(id => id !== permissionId),
    }));
  };

  const handleSelectAll = (category) => (event) => {
    if (!category || !category.permissions) return;
    
    const { checked } = event.target;
    const categoryPermissionIds = category.permissions.map(p => p.id);
    
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...new Set([...prev.permissions, ...categoryPermissionIds])]
        : prev.permissions.filter(id => !categoryPermissionIds.includes(id)),
    }));
  };

  const handleClearAll = () => {
    setFormData(prev => ({
      ...prev,
      permissions: [],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    } else if (!/^[a-z_]+$/.test(formData.name)) {
      newErrors.name = 'Role name should contain only lowercase letters and underscores';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Convert permission IDs back to names for the backend
      const permissionNames = formData.permissions.map(permissionId => {
        const permission = permissions.find(p => p.id === permissionId);
        return permission ? permission.name : null;
      }).filter(name => name !== null);

      const roleData = {
        name: formData.name,
        guard_name: formData.guard_name,
        permissions: permissionNames, // Send permission names to backend
      };

      console.log('Submitting role data:', roleData);

      if (isEdit) {
        await dispatch(updateRole({ id: roleId, data: roleData })).unwrap();
        enqueueSnackbar('Role updated successfully!', { variant: 'success' });
      } else {
        await dispatch(createRole(roleData)).unwrap();
        enqueueSnackbar('Role created successfully!', { variant: 'success' });
      }
      
      navigate('/admin/roles');
    } catch (error) {
      console.error('Error saving role:', error);
      enqueueSnackbar(
        error || `Failed to ${isEdit ? 'update' : 'create'} role`,
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/roles');
  };

  const isCategorySelected = (category) => {
    if (!category || !category.permissions) return false;
    const categoryPermissionIds = category.permissions.map(p => p.id);
    return categoryPermissionIds.every(permissionId => 
      formData.permissions.includes(permissionId)
    );
  };

  const isCategoryPartial = (category) => {
    if (!category || !category.permissions) return false;
    const categoryPermissionIds = category.permissions.map(p => p.id);
    const selectedCount = categoryPermissionIds.filter(permissionId => 
      formData.permissions.includes(permissionId)
    ).length;
    return selectedCount > 0 && selectedCount < categoryPermissionIds.length;
  };

  // Format permission name for display
  const formatPermissionName = (permissionName) => {
    if (!permissionName) return '';
    return permissionName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const permissionGroups = getFilteredPermissionGroups();
  const selectedPermissionNames = getSelectedPermissionNames();

  if (permissionsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Basic Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Role Name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    error={!!errors.name}
                    helperText={errors.name || "Lowercase letters and underscores only (e.g., 'content_manager')"}
                    disabled={loading}
                    placeholder="e.g., content_manager"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Guard Name"
                    value={formData.guard_name}
                    onChange={handleInputChange('guard_name')}
                    disabled={loading}
                    helperText="Typically 'web' for web applications"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      <strong>Note:</strong> Role names should follow the pattern: lowercase letters with underscores.
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Permissions */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Permissions
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip 
                    label={`${formData.permissions.length} permissions selected`}
                    color="primary"
                    variant="outlined"
                  />
                  <Tooltip title={showSelectedOnly ? "Show all permissions" : "Show selected only"}>
                    <IconButton
                      onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                      color={showSelectedOnly ? "primary" : "default"}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Alert severity="info" sx={{ mb: 3 }}>
                Select the permissions that users with this role will have. Be cautious when granting permissions.
              </Alert>

              {/* Debug Info - Remove in production */}
              <Box sx={{ mb: 2, p: 1, backgroundColor: theme.palette.grey[100], borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Debug: {formData.permissions.length} permissions selected (IDs: {formData.permissions.join(', ')})
                </Typography>
              </Box>

              {/* Selected Permissions Summary */}
              {formData.permissions.length > 0 && (
                <Box sx={{ mb: 3, p: 2, backgroundColor: theme.palette.success.light, borderRadius: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Selected Permissions ({formData.permissions.length}):
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedPermissionNames.map((name, index) => (
                      <Chip
                        key={index}
                        label={name}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {permissions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No permissions available
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {permissionGroups.map((category) => (
                    <Grid item xs={12} md={6} lg={4} key={category.category}>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          border: `2px solid ${
                            isCategorySelected(category) 
                              ? theme.palette.success.main 
                              : isCategoryPartial(category)
                              ? theme.palette.warning.main
                              : theme.palette.divider
                          }`,
                          backgroundColor: isCategorySelected(category) 
                            ? theme.palette.success.light + '20' 
                            : 'transparent',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isCategorySelected(category)}
                                indeterminate={isCategoryPartial(category)}
                                onChange={handleSelectAll(category)}
                                color="primary"
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {category.category} Permissions
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {getSelectedCountByCategory(category)}/{category.permissions.length} selected
                                </Typography>
                              </Box>
                            }
                          />
                          <Badge 
                            badgeContent={getSelectedCountByCategory(category)} 
                            color="success"
                            sx={{ 
                              '& .MuiBadge-badge': {
                                backgroundColor: isCategorySelected(category) 
                                  ? theme.palette.success.main 
                                  : theme.palette.primary.main,
                              }
                            }}
                          />
                        </Box>
                        
                        <FormGroup>
                          {category.permissions.map((permission) => (
                            <FormControlLabel
                              key={permission.id}
                              control={
                                <Checkbox
                                  checked={formData.permissions.includes(permission.id)}
                                  onChange={handlePermissionChange(permission.id)}
                                  color="success"
                                  sx={{
                                    '&.Mui-checked': {
                                      color: theme.palette.success.main,
                                    },
                                  }}
                                />
                              }
                              label={
                                <Box sx={{ 
                                  opacity: formData.permissions.includes(permission.id) ? 1 : 0.7,
                                  fontWeight: formData.permissions.includes(permission.id) ? 600 : 400,
                                }}>
                                  <Typography variant="body2" fontWeight="inherit">
                                    {formatPermissionName(permission.name)}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {permission.name} (ID: {permission.id})
                                  </Typography>
                                </Box>
                              }
                              sx={{
                                backgroundColor: formData.permissions.includes(permission.id) 
                                  ? theme.palette.success.light + '20' 
                                  : 'transparent',
                                borderRadius: 1,
                                px: 1,
                                mx: 0,
                                '&:hover': {
                                  backgroundColor: formData.permissions.includes(permission.id) 
                                    ? theme.palette.success.light + '30' 
                                    : theme.palette.action.hover,
                                },
                              }}
                            />
                          ))}
                        </FormGroup>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Clear All Button */}
              {formData.permissions.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleClearAll}
                    disabled={loading}
                  >
                    Clear All Permissions
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              disabled={loading}
              sx={{ borderRadius: 2, px: 4 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading || permissionsLoading || formData.permissions.length === 0}
              sx={{ borderRadius: 2, px: 4 }}
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Role' : 'Create Role')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoleForm;