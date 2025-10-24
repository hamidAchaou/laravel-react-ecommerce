// src/pages/admin/Permissions/PermissionCreate.jsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PermissionForm from './PermissionForm';

const PermissionCreate = () => {
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
        <Typography color="text.primary">Create Permission</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Create New Permission
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Define a new system permission for access control
        </Typography>
      </Box>

      {/* Permission Form */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <PermissionForm />
      </Paper>
    </Box>
  );
};

export default PermissionCreate;