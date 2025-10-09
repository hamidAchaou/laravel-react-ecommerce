// src/layouts/DashboardLayout.jsx
import React, { useState } from "react";
import { Box, CssBaseline, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminNav from "./admin/AdminNav";
import AdminAside from "./admin/AdminAside";

const drawerWidth = 240;

export default function DashboardLayout() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Navbar */}
      <AdminNav drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />

      {/* Sidebar */}
      <AdminAside
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          bgcolor: theme.palette.background.default,
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
