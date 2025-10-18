// src/components/admin/Roles/RoleForm.jsx
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// Mock permissions data
const mockPermissions = [
  {
    category: 'Users',
    permissions: [
      { id: 'users.read', name: 'users.read', display_name: 'View Users' },
      { id: 'users.create', name: 'users.create', display_name: 'Create Users' },
      { id: 'users.update', name: 'users.update', display_name: 'Update Users' },
      { id: 'users.delete', name: 'users.delete', display_name: 'Delete Users' },
    ],
  },
  {
    category: 'Products',
    permissions: [
      { id: 'products.read', name: 'products.read', display_name: 'View Products' },
      { id: 'products.create', name: 'products.create', display_name: 'Create Products' },
      { id: 'products.update', name: 'products.update', display_name: 'Update Products' },
      { id: 'products.delete', name: 'products.delete', display_name: 'Delete Products' },
    ],
  },
  {
    category: 'Orders',
    permissions: [
      { id: 'orders.read', name: 'orders.read', display_name: 'View Orders' },
      { id: 'orders.create', name: 'orders.create', display_name: 'Create Orders' },
      { id: 'orders.update', name: 'orders.update', display_name: 'Update Orders' },
      { id: 'orders.delete', name: 'orders.delete', display_name: 'Delete Orders' },
    ],
  },
  {
    category: 'Categories',
    permissions: [
      { id: 'categories.read', name: 'categories.read', display_name: 'View Categories' },
      { id: 'categories.create', name: 'categories.create', display_name: 'Create Categories' },
      { id: 'categories.update', name: 'categories.update', display_name: 'Update Categories' },
      { id: 'categories.delete', name: 'categories.delete', display_name: 'Delete Categories' },
    ],
  },
  {
    category: 'Roles',
    permissions: [
      { id: 'roles.read', name: 'roles.read', display_name: 'View Roles' },
      { id: 'roles.create', name: 'roles.create', display_name: 'Create Roles' },
      { id: 'roles.update', name: 'roles.update', display_name: 'Update Roles' },
      { id: 'roles.delete', name: 'roles.delete', display_name: 'Delete Roles' },
    ],
  },
];

const RoleForm = ({ roleId, isEdit = false }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    permissions: [],
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && roleId) {
      // Simulate fetching role data for editing
      const fetchRole = async () => {
        setLoading(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          // Mock role data - replace with actual API call
          setFormData({
            name: 'manager',
            display_name: 'Manager',
            description: 'Can manage products and orders',
            permissions: ['products.read', 'products.update', 'orders.read', 'orders.update'],
          });
        } catch (error) {
          enqueueSnackbar('Error loading role data', { variant: 'error' });
        } finally {
          setLoading(false);
        }
      };

      fetchRole();
    }
  }, [isEdit, roleId, enqueueSnackbar]);

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
    const { checked } = event.target;
    const categoryPermissions = category.permissions.map(p => p.id);
    
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...new Set([...prev.permissions, ...categoryPermissions])]
        : prev.permissions.filter(id => !categoryPermissions.includes(id)),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    } else if (!/^[a-z_]+$/.test(formData.name)) {
      newErrors.name = 'Role name should contain only lowercase letters and underscores';
    }
    
    if (!formData.display_name.trim()) {
      newErrors.display_name = 'Display name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      enqueueSnackbar(
        `Role ${isEdit ? 'updated' : 'created'} successfully!`,
        { variant: 'success' }
      );
      
      navigate('/admin/roles');
    } catch (error) {
      enqueueSnackbar(
        `Failed to ${isEdit ? 'update' : 'create'} role`,
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
    const categoryPermissions = category.permissions.map(p => p.id);
    return categoryPermissions.every(permission => 
      formData.permissions.includes(permission)
    );
  };

  const isCategoryPartial = (category) => {
    const categoryPermissions = category.permissions.map(p => p.id);
    const selectedCount = categoryPermissions.filter(permission => 
      formData.permissions.includes(permission)
    ).length;
    return selectedCount > 0 && selectedCount < categoryPermissions.length;
  };

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
                <Grid item xs={12} sm={6}>
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
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Display Name"
                    value={formData.display_name}
                    onChange={handleInputChange('display_name')}
                    error={!!errors.display_name}
                    helperText={errors.display_name}
                    disabled={loading}
                    placeholder="e.g., Content Manager"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    error={!!errors.description}
                    helperText={errors.description}
                    disabled={loading}
                    placeholder="Describe the role's purpose and responsibilities..."
                  />
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
                <Chip 
                  label={`${formData.permissions.length} permissions selected`}
                  color="primary"
                  variant="outlined"
                />
              </Box>

              <Alert severity="info" sx={{ mb: 3 }}>
                Select the permissions that users with this role will have. Be cautious when granting permissions.
              </Alert>

              <Grid container spacing={3}>
                {mockPermissions.map((category) => (
                  <Grid item xs={12} md={6} key={category.category}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        border: `2px solid ${
                          isCategorySelected(category) 
                            ? theme.palette.primary.main 
                            : isCategoryPartial(category)
                            ? theme.palette.warning.main
                            : theme.palette.divider
                        }`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                            <Typography variant="subtitle1" fontWeight={600}>
                              {category.category}
                            </Typography>
                          }
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
                                color="primary"
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  {permission.display_name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {permission.name}
                                </Typography>
                              </Box>
                            }
                          />
                        ))}
                      </FormGroup>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
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
              disabled={loading}
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