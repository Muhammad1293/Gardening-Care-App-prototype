import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, IconButton, Box, Paper, TextField, MenuItem, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select,
  Menu, Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import SpaIcon from "@mui/icons-material/Spa";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks"; 

import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState({ name: "", category: "", soil_type: "", climate: "" });
  const [openDialog, setOpenDialog] = useState(false);
const [selectedPlantId, setSelectedPlantId] = useState(null);
const [nicknameInput, setNicknameInput] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPlants();
    fetchUserData();
  }, []);

  const fetchPlants = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/plants", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlants(response.data);
    } catch (error) {
      console.error("Error fetching plants:", error);
    }
  };

  const handleOpenDialog = (plantId) => {
  setSelectedPlantId(plantId);
  setNicknameInput("");
  setOpenDialog(true);
};

const handleCloseDialog = () => {
  setOpenDialog(false);
};

const handleAddPlantWithNickname = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:5000/api/plant-tracking/add",
      { plant_id: selectedPlantId, nickname: nicknameInput },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert(" Plant added to your tracking list!");
    handleCloseDialog();
  } catch (error) {
    console.error("Error adding plant:", error);
    alert(" Failed to add plant. Maybe it's already tracked.");
  }
};


  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/plants/search", {
        headers: { Authorization: `Bearer ${token}` },
        params: search,
      });
      setPlants(response.data);
    } catch (error) {
      console.error("Error searching plants:", error);
    }
  };

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  return (
    <Box sx={{ width: "100%", height: "100vh", backgroundColor: "#E8F5E9" }}>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ backgroundColor: "green" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left: Menu Button */}
          <IconButton edge="start" color="white" onClick={toggleDrawer(true)} sx={{ color: "white"}}>
            <MenuIcon />
          </IconButton>

          {/* Center Title */}
          <Typography variant="h6" sx={{ flexGrow: 1, color:"white"}}>
            Gardening Care Dashboard
          </Typography>

          {/* Right: Profile */}
          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Notifications Button (Left of Avatar) */}
    <IconButton onClick={() => navigate("/notifications")} sx={{ color: "white" }}>
      <Badge badgeContent={0} color="error">
        <NotificationsIcon />
      </Badge>
    </IconButton>
              <Box sx={{ cursor: "pointer", display: "flex", alignItems: "center" }} onClick={handleMenuClick}>
                <Avatar sx={{ bgcolor: "#ffffff", color: "green", width: 40, height: 40 }}>
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </Avatar>
                <Box sx={{ ml: 1 }}>
                  <Typography sx={{ color: "white", fontWeight: "bold" }}>{user.username}</Typography>
                  <Typography sx={{ color: "white", fontSize: "12px" }}>{user.role}</Typography>
                </Box>
              </Box>

              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { handleMenuClose(); navigate("/profile"); }}>My Profile</MenuItem>
              </Menu>

              <IconButton onClick={handleLogout} sx={{ color: "white" }}>
                <LogoutIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer with improved hover and active states */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            <ListItem 
              button 
              onClick={() => navigate("/dashboard")}
              sx={{
                cursor: 'pointer',
                backgroundColor: location.pathname === '/dashboard' ? '#e8f5e9' : 'inherit',
                '&:hover': {
                  backgroundColor: '#e8f5e9',
                  '& .MuiListItemIcon-root': {
                    color: 'green',
                  },
                  '& .MuiTypography-root': {
                    color: 'green',
                    fontWeight: 'bold'
                  }
                }
              }}
            >
              <ListItemIcon>
                <LocalFloristIcon sx={{ color: location.pathname === '/dashboard' ? 'green' : 'inherit' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Search Plants" 
                sx={{ 
                  color: location.pathname === '/dashboard' ? 'green' : 'inherit',
                  fontWeight: location.pathname === '/dashboard' ? 'bold' : 'normal'
                }} 
              />
            </ListItem>
            <ListItem 
              button 
              onClick={() => navigate("/personalized-care")}
              sx={{
                cursor: 'pointer',
                backgroundColor: location.pathname === '/personalized-care' ? '#e8f5e9' : 'inherit',
                '&:hover': {
                  backgroundColor: '#e8f5e9',
                  '& .MuiListItemIcon-root': {
                    color: 'green',
                  },
                  '& .MuiTypography-root': {
                    color: 'green',
                    fontWeight: 'bold'
                  }
                }
              }}
            >
              <ListItemIcon>
                <SpaIcon sx={{ color: location.pathname === '/personalized-care' ? 'green' : 'inherit' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Personalized Care" 
                sx={{ 
                  color: location.pathname === '/personalized-care' ? 'green' : 'inherit',
                  fontWeight: location.pathname === '/personalized-care' ? 'bold' : 'normal'
                }} 
              />
            </ListItem>
            <ListItem 
              button 
              onClick={() => navigate("/plant-tracking")}
              sx={{
                cursor: 'pointer',
                backgroundColor: location.pathname === '/plant-tracking' ? '#e8f5e9' : 'inherit',
                '&:hover': {
                  backgroundColor: '#e8f5e9',
                  '& .MuiListItemIcon-root': {
                    color: 'green',
                  },
                  '& .MuiTypography-root': {
                    color: 'green',
                    fontWeight: 'bold'
                  }
                }
              }}
            >
              <ListItemIcon>
                <TrackChangesIcon sx={{ color: location.pathname === '/plant-tracking' ? 'green' : 'inherit' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Plant Tracking" 
                sx={{ 
                  color: location.pathname === '/plant-tracking' ? 'green' : 'inherit',
                  fontWeight: location.pathname === '/plant-tracking' ? 'bold' : 'normal'
                }} 
              />
            </ListItem>
            <ListItem 
  button 
  onClick={() => navigate("/interactive-tools")}
  sx={{
    cursor: 'pointer',
    backgroundColor: location.pathname === '/interactive-tools' ? '#e8f5e9' : 'inherit',
    '&:hover': {
      backgroundColor: '#e8f5e9',
      '& .MuiListItemIcon-root': { color: 'green' },
      '& .MuiTypography-root': {
        color: 'green',
        fontWeight: 'bold'
      }
    }
  }}
>
  <ListItemIcon>
    <LibraryBooksIcon sx={{ color: location.pathname === '/interactive-tools' ? 'green' : 'inherit' }} />
  </ListItemIcon>
  <ListItemText 
    primary="Tools & Resources" 
    sx={{ 
      color: location.pathname === '/interactive-tools' ? 'green' : 'inherit',
      fontWeight: location.pathname === '/interactive-tools' ? 'bold' : 'normal'
    }} 
  />
</ListItem>

          </List>
          <Divider />
        </Box>
      </Drawer>

      {/* Space below AppBar */}
      <Toolbar />

      {/* Search Section */}
      <Box sx={{ padding: 3 }}>
        <Paper sx={{ padding: 3 }}>
          <Typography variant="h6" fontWeight="bold"> Search for Plants</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: 2, flexWrap: "wrap" }}>
            <TextField
              label="Plant Name"
              variant="outlined"
              size="small"
              sx={{ minWidth: "250px" }}
              placeholder="Enter plant name"
              value={search.name}
              onChange={(e) => setSearch({ ...search, name: e.target.value })}
            />

            {[
              { label: "Category", field: "category", options: ["Flowering", "Vegetable", "Fruit"] },
              { label: "Soil Type", field: "soil_type", options: ["Loamy", "Sandy", "Clay", "Silty", "Peaty", "Chalky", "Saline"] },
              { label: "Climate", field: "climate", options: ["Tropical", "Temperate", "Arid", "Mediterranean", "Subtropical", "Continental", "Polar", "Cool", "Warm"] }
            ].map(({ label, field, options }) => (
              <FormControl key={field} size="small" sx={{ minWidth: "150px" }}>
                <InputLabel>{label}</InputLabel>
                <Select
                  value={search[field]}
                  onChange={(e) => setSearch({ ...search, [field]: e.target.value })}
                >
                  <MenuItem value="">Any {label}</MenuItem>
                  {options.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}

            <Button variant="contained" color="success" startIcon={<SearchIcon />} onClick={handleSearch}>
              Search
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Results Table */}
      <Box sx={{ padding: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#66BB6A" }}>
                {["Name", "Category", "Soil Type", "Climate", "Care Instructions", "Action"].map((col) => (
                  <TableCell key={col} sx={{ fontWeight: "bold", color: "white" }}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {plants.length > 0 ? plants.map((plant) => (
                <TableRow key={plant.id}>
                  <TableCell>{plant.name}</TableCell>
                  <TableCell>{plant.category}</TableCell>
                  <TableCell>{plant.soil_type}</TableCell>
                  <TableCell>{plant.climate}</TableCell>
                  <TableCell>{plant.care_instructions}</TableCell>
                  <TableCell>
                  <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog(plant.id)}
                       >
                      Add to My Plants
                  </Button>
                 </TableCell>

                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={5} sx={{ textAlign: "center" }}>No plants found </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
  <DialogTitle>Add Plant to Tracking</DialogTitle>
  <DialogContent>
    <TextField
      autoFocus
      margin="dense"
      label="Nickname (Optional)"
      fullWidth
      value={nicknameInput}
      onChange={(e) => setNicknameInput(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
    <Button onClick={handleAddPlantWithNickname} variant="contained" color="success">
      Add
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default Dashboard;