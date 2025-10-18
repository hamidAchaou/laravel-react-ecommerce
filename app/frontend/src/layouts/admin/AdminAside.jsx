// src/layouts/admin/AdminAside.jsx
import React, { memo, useState } from "react";
import {
  Box,
  Drawer,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Toolbar,
  useTheme,
  Collapse,
  IconButton,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { BRAND_COLORS } from "../../theme/colors";
import {
  ExpandLess,
  ExpandMore,
  Dashboard,
  ShoppingBag,
  Category,
  People,
  Security,
  Key,
  AdminPanelSettings,
  Group,
} from "@mui/icons-material";

const AdminAside = ({ mobileOpen, handleDrawerToggle, drawerWidth = 240 }) => {
  const theme = useTheme();
  const location = useLocation();
  
  // ✅ Always use dark palette for the sidebar
  const colors = BRAND_COLORS.dark;

  // State for expandable sections
  const [accessControlOpen, setAccessControlOpen] = useState(true);

  const toggleAccessControl = () => {
    setAccessControlOpen(!accessControlOpen);
  };

  // Navigation items structure
  const navSections = [
    {
      id: "dashboard",
      to: "/admin",
      label: "Dashboard",
      icon: <Dashboard fontSize="small" />,
    },
    {
      id: "products",
      to: "/admin/products",
      label: "Products",
      icon: <ShoppingBag fontSize="small" />,
    },
    {
      id: "orders",
      to: "/admin/orders",
      label: "Orders",
      icon: <Category fontSize="small" />,
    },
    {
      id: "categories",
      to: "/admin/categories",
      label: "Categories",
      icon: <Category fontSize="small" />,
    },
  ];

  const accessControlItems = [
    {
      id: "users",
      to: "/admin/users",
      label: "Users",
      icon: <People fontSize="small" />,
    },
    {
      id: "roles",
      to: "/admin/roles",
      label: "Roles",
      icon: <Security fontSize="small" />,
    },
    // You can add permissions later if needed
    // {
    //   id: "permissions",
    //   to: "/admin/permissions",
    //   label: "Permissions",
    //   icon: <Key fontSize="small" />,
    // },
  ];

  const renderNavItem = (item, level = 0) => (
    <ListItemButton
      key={item.to}
      component={NavLink}
      to={item.to}
      end={item.to === "/admin"}
      sx={{
        "&.active": {
          bgcolor: colors.primary,
          color: colors.surface,
          "& .MuiListItemIcon-root": {
            color: colors.surface,
          },
        },
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.08)",
        },
        mx: 1,
        borderRadius: 2,
        color: colors.textPrimary,
        transition: "all 0.2s ease-in-out",
        pl: 2 + level * 2,
        py: 1,
        mb: 0.5,
      }}
    >
      {item.icon && (
        <ListItemIcon
          sx={{
            minWidth: 40,
            color: "inherit",
          }}
        >
          {item.icon}
        </ListItemIcon>
      )}
      <ListItemText
        primary={item.label}
        primaryTypographyProps={{
          fontWeight: 500,
          variant: "body2",
          sx: { textTransform: "capitalize" },
        }}
      />
    </ListItemButton>
  );

  const DrawerContent = (
    <Box
      sx={{
        textAlign: "left",
        bgcolor: colors.surface,
        height: "100%",
        color: colors.textPrimary,
        display: "flex",
        flexDirection: "column",
        boxShadow: "inset 0 0 12px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header */}
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <AdminPanelSettings 
            sx={{ 
              mr: 2, 
              color: colors.accent,
              fontSize: 28 
            }} 
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              letterSpacing: 1,
              textTransform: "uppercase",
              color: colors.accent,
              fontSize: "1.1rem",
            }}
          >
            Admin
          </Typography>
        </Box>
      </Toolbar>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", mb: 1 }} />

      {/* Main Navigation */}
      <List sx={{ flexGrow: 1, py: 1 }}>
        {/* Regular Sections */}
        {navSections.map((item) => renderNavItem(item))}

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 2, mx: 2 }} />

        {/* Access Control Section */}
        <Box>
          <ListItemButton
            onClick={toggleAccessControl}
            sx={{
              mx: 1,
              borderRadius: 2,
              color: colors.textPrimary,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: colors.accent,
              }}
            >
              <Group fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Access Control"
              primaryTypographyProps={{
                fontWeight: 600,
                variant: "body2",
                fontSize: "0.9rem",
              }}
            />
            {accessControlOpen ? (
              <ExpandLess sx={{ color: colors.textSecondary, fontSize: 18 }} />
            ) : (
              <ExpandMore sx={{ color: colors.textSecondary, fontSize: 18 }} />
            )}
          </ListItemButton>

          <Collapse in={accessControlOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {accessControlItems.map((item) => renderNavItem(item, 1))}
            </List>
          </Collapse>
        </Box>
      </List>

      {/* Footer */}
      <Box sx={{ py: 2, px: 2 }}>
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", mb: 2 }} />
        <Typography 
          variant="caption" 
          color={colors.textSecondary}
          sx={{ 
            display: "block", 
            textAlign: "center",
            fontSize: "0.75rem",
          }}
        >
          © {new Date().getFullYear()} Hamid Achaou
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: colors.surface,
            borderRight: `1px solid ${colors.background}`,
          },
        }}
      >
        {DrawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: colors.surface,
            borderRight: `1px solid ${colors.background}`,
          },
        }}
      >
        {DrawerContent}
      </Drawer>
    </Box>
  );
};

export default memo(AdminAside);