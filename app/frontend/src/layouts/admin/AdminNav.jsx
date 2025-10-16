import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useColorMode } from "../../context/ThemeContext";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authThunks";
import { useNavigate } from "react-router-dom";

// Mock user (replace with dynamic user from Redux store if available)
const mockUser = {
  name: "Jane Doe",
  profileImage: "https://i.pravatar.cc/150?img=47",
};

export default function AdminNav({ drawerWidth, handleDrawerToggle }) {
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();
  const isDarkMode = mode === "dark";

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Menu handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Logout handler
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      console.log("Logged out successfully!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      handleMenuClose();
    }
  };

  // Profile navigation
  const handleProfileRedirect = () => {
    console.log("Navigate to profile");
    navigate("/profile"); // Example route
    handleMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[1],
      }}
    >
      <Toolbar>
        {/* Hamburger menu for small screens */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Title */}
        <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 600 }}>
          Admin Dashboard
        </Typography>

        {/* Theme toggle */}
        <IconButton
          onClick={toggleColorMode}
          color="inherit"
          title="Toggle theme"
        >
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        {/* Profile avatar */}
        <Box sx={{ ml: 2 }}>
          <IconButton onClick={handleMenuOpen} size="small" sx={{ p: 0 }}>
            {mockUser.profileImage ? (
              <Avatar
                alt={mockUser.name}
                src={mockUser.profileImage}
                sx={{ width: 32, height: 32 }}
              />
            ) : (
              <AccountCircleIcon sx={{ width: 32, height: 32 }} />
            )}
          </IconButton>
        </Box>

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleProfileRedirect}>
            <SettingsIcon sx={{ mr: 1 }} /> Profile & Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1, color: theme.palette.error.main }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
