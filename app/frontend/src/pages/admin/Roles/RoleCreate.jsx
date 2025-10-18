// src/pages/admin/Roles/RoleCreate.jsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RoleForm from '../../../components/admin/Roles/RoleForm';

const RoleCreate = () => {
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
        <Typography color="text.primary">Create Role</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Create New Role
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Define a new role with specific permissions and access levels
        </Typography>
      </Box>

      {/* Role Form */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <RoleForm />
      </Paper>
    </Box>
  );
};

export default RoleCreate;