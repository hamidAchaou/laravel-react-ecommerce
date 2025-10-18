// src/components/admin/Users/UserRoleChip.jsx
import React from 'react';
import { Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AdminPanelSettings, Person, SupportAgent } from '@mui/icons-material';

const UserRoleChip = ({ role }) => {
  const theme = useTheme();

  const roleConfig = {
    admin: {
      label: 'Admin',
      color: 'error',
      icon: <AdminPanelSettings fontSize="small" />,
    },
    manager: {
      label: 'Manager',
      color: 'secondary',
      icon: <SupportAgent fontSize="small" />,
    },
    user: {
      label: 'User',
      color: 'primary',
      icon: <Person fontSize="small" />,
    },
    customer: {
      label: 'Customer',
      color: 'default',
      icon: <Person fontSize="small" />,
    },
  };

  const config = roleConfig[role] || roleConfig.user;

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      variant="outlined"
      size="small"
      sx={{ 
        fontWeight: 600,
        borderRadius: 1,
      }}
    />
  );
};

export default UserRoleChip;