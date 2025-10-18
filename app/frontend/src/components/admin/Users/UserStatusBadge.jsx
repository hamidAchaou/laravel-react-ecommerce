// src/components/admin/Users/UserStatusBadge.jsx
import React from 'react';
import { Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const UserStatusBadge = ({ status }) => {
  const theme = useTheme();

  const statusConfig = {
    active: {
      label: 'Active',
      color: 'success',
      variant: 'filled',
    },
    inactive: {
      label: 'Inactive',
      color: 'default',
      variant: 'outlined',
    },
    suspended: {
      label: 'Suspended',
      color: 'error',
      variant: 'filled',
    },
    pending: {
      label: 'Pending',
      color: 'warning',
      variant: 'outlined',
    },
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <Chip
      label={config.label}
      color={config.color}
      variant={config.variant}
      size="small"
      sx={{ 
        fontWeight: 600,
        borderRadius: 1,
        minWidth: 80,
      }}
    />
  );
};

export default UserStatusBadge;