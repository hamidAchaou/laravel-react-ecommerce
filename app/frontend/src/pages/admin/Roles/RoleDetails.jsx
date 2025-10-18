// src/pages/admin/Roles/RoleDetails.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  Breadcrumbs,
  Link,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  useTheme,
} from "@mui/material";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import {
  SecurityIcon,
  EditIcon,
  ArrowBackIcon,
  PeopleIcon,
  PermissionsIcon,
  CalendarTodayIcon,
  UpdateIcon,
} from "@mui/icons-material";

// Mock data - replace with actual API call
const mockRoleDetails = {
  id: 1,
  name: "admin",
  display_name: "Administrator",
  description: "Full system access with all permissions. Can manage users, products, orders, and system settings.",
  permissions: [
    { id: 1, name: "users.create", display_name: "Create Users" },
    { id: 2, name: "users.read", display_name: "View Users" },
    { id: 3, name: "users.update", display_name: "Update Users" },
    { id: 4, name: "users.delete", display_name: "Delete Users" },
    { id: 5, name: "products.manage", display_name: "Manage Products" },
    { id: 6, name: "orders.manage", display_name: "Manage Orders" },
    { id: 7, name: "categories.manage", display_name: "Manage Categories" },
    { id: 8, name: "roles.manage", display_name: "Manage Roles" },
  ],
  users_count: 3,
  is_system: true,
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2024-03-20T14:45:00Z",
};

const RoleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoleDetails = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setRole(mockRoleDetails);
      } catch (error) {
        console.error("Error fetching role details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleDetails();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
        <Typography>Loading role details...</Typography>
      </Box>
    );
  }

  if (!role) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography variant="h6" color="error">
          Role not found
        </Typography>
        <Button 
          component={RouterLink} 
          to="/admin/roles" 
          sx={{ mt: 2 }}
        >
          Back to Roles
        </Button>
      </Box>
    );
  }

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
        <Typography color="text.primary">{role.display_name}</Typography>
      </Breadcrumbs>

      {/* Header Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/roles")}
            sx={{ textTransform: 'none' }}
          >
            Back to Roles
          </Button>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/admin/roles/edit/${id}`)}
          disabled={role.is_system}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
          }}
        >
          Edit Role
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Role Information Card */}
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mb: 2,
                    bgcolor: role.is_system ? theme.palette.primary.main : theme.palette.secondary.main,
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 40 }} />
                </Avatar>
                
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {role.display_name}
                </Typography>
                
                <Chip
                  label={role.is_system ? "System Role" : "Custom Role"}
                  color={role.is_system ? "primary" : "default"}
                  variant={role.is_system ? "filled" : "outlined"}
                  sx={{ mb: 2 }}
                />
                
                <Typography variant="body2" color="text.secondary">
                  {role.name}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Role Stats */}
              <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <Box>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    {role.permissions.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Permissions
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700} color="secondary">
                    {role.users_count}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card 
            sx={{ 
              mt: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Role Information
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Created"
                    secondary={new Date(role.created_at).toLocaleDateString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <UpdateIcon fontSize="small" color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Last Updated"
                    secondary={new Date(role.updated_at).toLocaleDateString()}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Permissions Card */}
        <Grid item xs={12} md={8}>
          <Card 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: `1px solid ${theme.palette.divider}`,
              height: 'fit-content'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {role.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PermissionsIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  Permissions ({role.permissions.length})
                </Typography>
              </Box>

              <Grid container spacing={1}>
                {role.permissions.map((permission) => (
                  <Grid item xs={12} sm={6} key={permission.id}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                        },
                      }}
                    >
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        {permission.display_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {permission.name}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {role.permissions.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <PeopleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No permissions assigned to this role
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoleDetails;