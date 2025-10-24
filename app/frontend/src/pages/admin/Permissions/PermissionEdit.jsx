// src/pages/admin/Permissions/PermissionEdit.jsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
  Alert,
} from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import PermissionForm from './PermissionForm';

const PermissionEdit = () => {
  const { id } = useParams();

  return (
    <Box component="main" sx={{ p: { xs: 2, md: 3 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/admin" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Link component={RouterLink} to="/admin/permissions" underline="hover" color="inherit">
          Permissions
        </Link>
        <Typography color="text.primary">Edit Permission</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Edit Permission
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Modify permission details and access rules
        </Typography>
      </Box>

      {/* System Permission Warning */}
      <Alert severity="warning" sx={{ mb: 3 }}>
        Note: Modifying system permissions may affect core functionality. Proceed with caution.
      </Alert>

      {/* Permission Form */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <PermissionForm permissionId={id} isEdit />
      </Paper>
    </Box>
  );
};

export default PermissionEdit;