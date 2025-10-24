// src/pages/admin/Permissions/PermissionForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  Card,
  CardContent,
  useTheme,
  MenuItem,
  InputAdornment,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import { createPermission, updatePermission, fetchPermissionById } from '../../../features/permissions/permissionsThunks';

const PermissionForm = ({ permissionId, isEdit = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  // Redux state with safe access
  const permissionsState = useSelector((state) => state.permissions);
  const permission = permissionsState?.current || {};
  const loading = permissionsState?.loading || false;

  const [formData, setFormData] = useState({
    name: '',
    guard_name: 'web',
    category: 'general', // Frontend-only field for organization
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Permission categories (frontend-only for organization)
  const categories = [
    { value: 'read', label: 'Read Access', description: 'View and read operations' },
    { value: 'write', label: 'Write Access', description: 'Create and update operations' },
    { value: 'delete', label: 'Delete Access', description: 'Delete and remove operations' },
    { value: 'admin', label: 'Administrative', description: 'System administration operations' },
    { value: 'general', label: 'General', description: 'Other permissions' },
  ];

  // Common permission patterns for suggestions
  const permissionPatterns = [
    { pattern: 'view_{resource}', example: 'view_users' },
    { pattern: 'create_{resource}', example: 'create_products' },
    { pattern: 'edit_{resource}', example: 'edit_orders' },
    { pattern: 'delete_{resource}', example: 'delete_categories' },
    { pattern: 'manage_{resource}', example: 'manage_settings' },
    { pattern: 'export_{resource}', example: 'export_reports' },
    { pattern: 'import_{resource}', example: 'import_data' },
  ];

  // Fetch permission data if editing
  useEffect(() => {
    const initializeData = async () => {
      if (isEdit && permissionId) {
        try {
          const result = await dispatch(fetchPermissionById(permissionId)).unwrap();
          const permissionData = result.data || result;
          
          setFormData({
            name: permissionData.name || '',
            guard_name: permissionData.guard_name || 'web',
            category: getPermissionCategory(permissionData.name) || 'general',
          });
        } catch (error) {
          console.error('Error loading permission:', error);
          enqueueSnackbar('Error loading permission data', { variant: 'error' });
        }
      }
    };

    initializeData();
  }, [isEdit, permissionId, dispatch, enqueueSnackbar]);

  const getPermissionCategory = (permissionName) => {
    if (!permissionName) return 'general';
    
    const categoriesMap = {
      'view': 'read',
      'create': 'write', 
      'edit': 'write',
      'update': 'write',
      'delete': 'delete',
      'manage': 'admin',
      'admin': 'admin'
    };
    
    const prefix = permissionName.split('_')[0];
    return categoriesMap[prefix] || 'general';
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    
    // Auto-detect category based on permission name
    if (field === 'name' && value) {
      const detectedCategory = getPermissionCategory(value);
      setFormData(prev => ({
        ...prev,
        [field]: value,
        category: prev.category === 'general' ? detectedCategory : prev.category,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Permission name is required';
    } else if (!/^[a-z_]+$/.test(formData.name)) {
      newErrors.name = 'Permission name should contain only lowercase letters and underscores';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Permission name should be at least 3 characters long';
    } else if (formData.name.length > 255) {
      newErrors.name = 'Permission name should not exceed 255 characters';
    }
    
    if (!formData.guard_name.trim()) {
      newErrors.guard_name = 'Guard name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      // ✅ FIXED: Only send Spatie permission fields (name and guard_name)
      const permissionData = {
        name: formData.name,
        guard_name: formData.guard_name,
      };

      if (isEdit) {
        await dispatch(updatePermission({ id: permissionId, data: permissionData })).unwrap();
        enqueueSnackbar('Permission updated successfully!', { variant: 'success' });
      } else {
        await dispatch(createPermission(permissionData)).unwrap();
        enqueueSnackbar('Permission created successfully!', { variant: 'success' });
      }
      
      navigate('/admin/permissions');
    } catch (error) {
      console.error('Error saving permission:', error);
      enqueueSnackbar(
        error || `Failed to ${isEdit ? 'update' : 'create'} permission`,
        { variant: 'error' }
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/permissions');
  };

  const formatPermissionName = (name) => {
    if (!name) return '';
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getCategoryColor = (category) => {
    const colors = {
      read: 'info',
      write: 'warning',
      delete: 'error',
      admin: 'secondary',
      general: 'default'
    };
    return colors[category] || 'default';
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
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Permission Name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    error={!!errors.name}
                    helperText={errors.name || "Lowercase letters and underscores only (e.g., 'view_users')"}
                    disabled={submitting || loading}
                    placeholder="e.g., view_users"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Category"
                    value={formData.category}
                    onChange={handleInputChange('category')}
                    disabled={submitting}
                    helperText="Permission category for organization (frontend only)"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        <Box>
                          <Typography variant="body2">
                            {category.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {category.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Guard Name"
                    value={formData.guard_name}
                    onChange={handleInputChange('guard_name')}
                    error={!!errors.guard_name}
                    helperText={errors.guard_name || "Typically 'web' for web applications"}
                    disabled={submitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SecurityIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="web">Web</MenuItem>
                    <MenuItem value="api">API</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Permission Preview & Patterns */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Permission Preview & Patterns
              </Typography>

              {/* Current Permission Preview */}
              {formData.name && (
                <Box sx={{ mb: 3, p: 2, backgroundColor: theme.palette.primary.light, borderRadius: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Preview:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={formData.name}
                      color="primary"
                      variant="filled"
                      sx={{ fontWeight: 600 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      →
                    </Typography>
                    <Chip
                      label={formatPermissionName(formData.name)}
                      color="secondary"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      →
                    </Typography>
                    <Chip
                      label={formData.category.toUpperCase()}
                      color={getCategoryColor(formData.category)}
                      variant="filled"
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      →
                    </Typography>
                    <Chip
                      label={`Guard: ${formData.guard_name.toUpperCase()}`}
                      color="default"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>
              )}

              {/* Common Patterns */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Common Permission Patterns:
                </Typography>
                <Grid container spacing={1}>
                  {permissionPatterns.map((pattern, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box 
                        sx={{ 
                          p: 1.5, 
                          borderRadius: 1,
                          border: `1px solid ${theme.palette.divider}`,
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                        onClick={() => setFormData(prev => ({ ...prev, name: pattern.example }))}
                      >
                        <Typography variant="caption" color="text.secondary" display="block">
                          {pattern.pattern}
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {pattern.example}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Best Practices:</strong> Use descriptive names following the pattern: <code>action_resource</code>. 
                  Be consistent with naming conventions across your application. Category is for frontend organization only.
                </Typography>
              </Alert>
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
              disabled={submitting}
              sx={{ borderRadius: 2, px: 4 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={submitting || loading || !formData.name}
              sx={{ borderRadius: 2, px: 4 }}
            >
              {submitting ? 'Saving...' : (isEdit ? 'Update Permission' : 'Create Permission')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PermissionForm;