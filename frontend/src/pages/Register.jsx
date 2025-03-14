import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Button } from "@mui/material";
import { Menu as MenuIcon, AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const username = "User123"; // Replace with actual username from context/state

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateProfile = () => {
    handleClose();
    navigate("/profile-update"); // Redirect to profile update page
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Full-width header */}
      <AppBar position="static" sx={{ backgroundColor: "#2E7D32" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#fff" }}>
            Gardening Care Dashboard
          </Typography>

          {/* Profile section */}
          <Box>
            <IconButton onClick={handleProfileClick} color="inherit">
              <AccountCircle />
            </IconButton>
            <Typography variant="body1" sx={{ color: "#fff", display: "inline", marginLeft: "8px" }}>
              {username}
            </Typography>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleUpdateProfile}>Update Profile</MenuItem>
              <MenuItem onClick={() => navigate("/logout")}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Dashboard Content */}
      <Box sx={{ padding: 3, backgroundColor: "#E8F5E9", minHeight: "100vh" }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Welcome to Gardening Care Dashboard
        </Typography>

        {/* Search Section (Already added to Dashboard) */}
        <Box sx={{ backgroundColor: "#fff", padding: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            🌿 Search for Plants
          </Typography>
          {/* Add Search Form Here */}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
