// src/pages/admin/Roles/RoleEdit.jsx
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
import RoleForm from './RoleForm';

const RoleEdit = () => {
  const { id } = useParams();

  return (
    <Box component="main" sx={{ p: { xs: 2, md: 3 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/admin" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Link component={RouterLink} to="/admin/roles" underline="hover" color="inherit">
          Roles & Permissions
        </Link>
        <Typography color="text.primary">Edit Role</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Edit Role
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Modify role details and permissions
        </Typography>
      </Box>

      {/* System Role Warning */}
      <Alert severity="warning" sx={{ mb: 3 }}>
        Note: Some system roles have restricted modifications for security reasons.
      </Alert>

      {/* Role Form */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <RoleForm roleId={id} isEdit />
      </Paper>
    </Box>
  );
};

export default RoleEdit;