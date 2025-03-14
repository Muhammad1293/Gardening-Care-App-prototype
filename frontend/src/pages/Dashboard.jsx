import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Paper, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Menu, MenuItem as MenuItemMUI } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateProfile = () => {
    handleClose();
    navigate("/profile"); // Redirects to the profile update page
  };

  return (
    <Box sx={{ width: "100vw", height: "100vh", backgroundColor: "#E8F5E9", display: "flex", flexDirection: "column" }}>
      
      {/* Full Width Header */}
      <AppBar position="static" sx={{ width: "100vw", backgroundColor: "green" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon sx={{ color: "white" }} />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "white" }}>
            Gardening Care Dashboard
          </Typography>

          {/* Profile Section */}
          <Box sx={{ display: "flex", alignItems: "center", marginRight: 2 }}>
            <IconButton onClick={handleProfileClick}>
              <Avatar sx={{ width: 40, height: 40 }} /> {/* Bigger profile icon */}
            </IconButton>
            <Typography variant="body1" sx={{ color: "white", marginLeft: 1 }}>Username</Typography>
          </Box>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItemMUI onClick={handleUpdateProfile}>Update Profile</MenuItemMUI>
          </Menu>

          <Button color="inherit" sx={{ color: "white" }}>Logout</Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ display: "flex", flex: 1, padding: 2 }}>
        
        {/* Sidebar Menu */}
        <Paper sx={{ width: 250, padding: 2, backgroundColor: "#FFFFFF", marginRight: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
            🌱 Gardening Menu
          </Typography>
          <Typography variant="body2">
            Add future features here like weather updates, gardening tips, etc.
          </Typography>
        </Paper>

        {/* Search Section */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ padding: 3, backgroundColor: "#FFFFFF", marginBottom: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
              🌿 Search for Plants
            </Typography>
            <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
              <TextField label="Plant Name" variant="outlined" fullWidth />
              <TextField select label="Type" variant="outlined" sx={{ minWidth: 150 }}>
                <MenuItem value="All">All Types</MenuItem>
                <MenuItem value="Flowering">Flowering</MenuItem>
                <MenuItem value="Vegetable">Vegetable</MenuItem>
              </TextField>
              <Button variant="contained" color="success" startIcon={<SearchIcon />}>
                Search
              </Button>
            </Box>
          </Paper>

          {/* Plant Data Table */}
          <Paper sx={{ padding: 2, backgroundColor: "#FFFFFF" }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#66BB6A" }}>
                    <TableCell sx={{ fontWeight: "bold", color: "white" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white" }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white" }}>Age</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white" }}>Growth Stage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                      No plants found 🌱
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
