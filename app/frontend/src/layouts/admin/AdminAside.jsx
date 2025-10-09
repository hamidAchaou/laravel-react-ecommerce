// src/layouts/admin/AdminAside.jsx
import React, { memo } from "react";
import {
  Box,
  Drawer,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Toolbar,
  useTheme,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { BRAND_COLORS } from "../../theme/colors";

const AdminAside = ({ mobileOpen, handleDrawerToggle, drawerWidth = 240 }) => {
  const theme = useTheme();

  // ✅ Always use dark palette for the sidebar
  const colors = BRAND_COLORS.dark;

  const navItems = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/orders", label: "Orders" },
    { to: "/admin/users", label: "Users" },
  ];

  const renderNavItem = (item) => (
    <ListItemButton
      key={item.to}
      component={NavLink}
      to={item.to}
      end={item.to === "/admin"}
      sx={{
        "&.active": {
          bgcolor: colors.primary,
          color: colors.surface,
        },
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.08)",
        },
        mx: 1,
        borderRadius: 2,
        color: colors.textPrimary,
        transition: "all 0.2s ease-in-out",
      }}
    >
      <ListItemText
        primary={item.label}
        primaryTypographyProps={{
          fontWeight: 500,
          variant: "body1",
          sx: { textTransform: "capitalize" },
        }}
      />
    </ListItemButton>
  );

  const DrawerContent = (
    <Box
      sx={{
        textAlign: "center",
        bgcolor: colors.surface, // ✅ Always dark color from BRAND_COLORS.dark
        height: "100%",
        color: colors.textPrimary,
        display: "flex",
        flexDirection: "column",
        boxShadow: "inset 0 0 12px rgba(0,0,0,0.4)",
      }}
    >
      <Toolbar />

      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          letterSpacing: 1,
          mb: 2,
          textTransform: "uppercase",
          color: colors.accent,
        }}
      >
        Admin Panel
      </Typography>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", mb: 2 }} />

      <List sx={{ flexGrow: 1 }}>{navItems.map(renderNavItem)}</List>

      <Box sx={{ py: 2 }}>
        <Typography variant="caption" color={colors.textSecondary}>
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
            bgcolor: colors.surface, // ✅ stays dark
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
            bgcolor: colors.surface, // ✅ stays dark
          },
        }}
      >
        {DrawerContent}
      </Drawer>
    </Box>
  );
};

export default memo(AdminAside);
