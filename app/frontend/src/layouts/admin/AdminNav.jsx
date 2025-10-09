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

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => console.log("Logging out...");
  const handleProfileRedirect = () => console.log("Navigate to profile");

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
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 600 }}>
          Admin Dashboard
        </Typography>

        {/* Theme Toggle */}
        <IconButton onClick={toggleColorMode} color="inherit" title="Toggle theme">
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        {/* Profile */}
        <Box sx={{ ml: 2 }}>
          <IconButton onClick={handleMenuOpen} size="small" sx={{ p: 0 }}>
            {mockUser.profileImage ? (
              <Avatar alt={mockUser.name} src={mockUser.profileImage} sx={{ width: 32, height: 32 }} />
            ) : (
              <AccountCircleIcon sx={{ width: 32, height: 32 }} />
            )}
          </IconButton>
        </Box>

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
            <LogoutIcon sx={{ mr: 1, color: theme.palette.error.main }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
