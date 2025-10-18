import React from 'react';
import { Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  AdminPanelSettings, 
  Storefront, 
  Person, 
  SupportAgent 
} from '@mui/icons-material';

const UserRoleChip = ({ role }) => {
  const theme = useTheme();

  // Define visual style for each role
  const roleConfig = {
    admin: {
      label: 'Admin',
      color: 'error',
      icon: <AdminPanelSettings fontSize="small" />,
    },
    seller: {
      label: 'Seller',
      color: 'secondary',
      icon: <Storefront fontSize="small" />,
    },
    customer: {
      label: 'Customer',
      color: 'primary',
      icon: <Person fontSize="small" />,
    },
    manager: {
      label: 'Manager',
      color: 'info',
      icon: <SupportAgent fontSize="small" />,
    },
  };

  // Use a default config if role not found
  const config = roleConfig[role] || {
    label: role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User',
    color: 'default',
    icon: <Person fontSize="small" />,
  };

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
        textTransform: 'capitalize',
      }}
    />
  );
};

export default UserRoleChip;
