import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Box, Paper, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select,
  MenuItem, IconButton, Avatar, Menu, Button, Drawer, List, ListItem,
  ListItemIcon, ListItemText, Divider
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import SpaIcon from "@mui/icons-material/Spa";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks"; 

const PlantTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [plants, setPlants] = useState([]);
  const [userPlants, setUserPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [nickname, setNickname] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

 useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const userRes = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  fetchUser();
}, []);

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const plantsRes = await axios.get("http://localhost:5000/api/plants", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlants(plantsRes.data);

      const trackedRes = await axios.get("http://localhost:5000/api/plant-tracking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserPlants(trackedRes.data);
    } catch (error) {
      console.error("Error fetching plants or tracked plants:", error);
    }
  };

  // Run only after user is loaded
  if (user) fetchData();
}, [user]);
 
  const handleAddPlant = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:5000/api/plant-tracking/add",
      { plant_id: selectedPlant, nickname },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Make sure you append the new plant to userPlants
    if (response.data) {
      setUserPlants((prev) => [...prev, response.data]);
    }

    setSelectedPlant("");
    setNickname("");
  } catch (error) {
    console.error("Error adding plant:", error);
  }
};


  const handleRemovePlant = async (trackingId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/plant-tracking/remove/${trackingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserPlants(userPlants.filter((plant) => plant.id !== trackingId));
    } catch (error) {
      console.error("Error removing plant:", error);
    }
  };

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleDrawer = (open) => () => setDrawerOpen(open);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", backgroundColor: "#E8F5E9" }}>
      {/* Header */}
      <AppBar position="fixed" sx={{ backgroundColor: "green" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)} sx={{ color: "white"}}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, color: "white" }}>
            Plant Tracking & Monitoring
          </Typography>

          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* Notifications Button (Left of Avatar) */}
                  <IconButton onClick={() => navigate("/notifications")} sx={{ color: "white" }}>
                    <Badge badgeContent={0} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
              <Box onClick={handleMenuClick} sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#ffffff", color: "green" }}>
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

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            <ListItem button onClick={() => navigate("/dashboard")}
              sx={{
                cursor: 'pointer',
                backgroundColor: location.pathname === '/dashboard' ? '#e8f5e9' : 'inherit',
                '&:hover': { backgroundColor: '#e8f5e9' }
              }}
            >
              <ListItemIcon><LocalFloristIcon sx={{ color: location.pathname === '/dashboard' ? 'green' : 'inherit' }} /></ListItemIcon>
              <ListItemText primary="Search Plants" />
            </ListItem>
            <ListItem button onClick={() => navigate("/personalized-care")}
              sx={{
                cursor: 'pointer',
                backgroundColor: location.pathname === '/personalized-care' ? '#e8f5e9' : 'inherit',
                '&:hover': { backgroundColor: '#e8f5e9' }
              }}
            >
              <ListItemIcon><SpaIcon sx={{ color: location.pathname === '/personalized-care' ? 'green' : 'inherit' }} /></ListItemIcon>
              <ListItemText primary="Personalized Care" />
            </ListItem>
            <ListItem button onClick={() => navigate("/plant-tracking")}
              sx={{
                cursor: 'pointer',
                backgroundColor: location.pathname === '/plant-tracking' ? '#e8f5e9' : 'inherit',
                '&:hover': { backgroundColor: '#e8f5e9' }
              }}
            >
              <ListItemIcon><TrackChangesIcon sx={{ color: location.pathname === '/plant-tracking' ? 'green' : 'inherit' }} /></ListItemIcon>
              <ListItemText primary="Plant Tracking" />
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

      <Toolbar />

      {/* Main Content */}
      <Box sx={{ padding: 3 }}>
        {/* Add New Plant Section */}
        <Paper sx={{ padding: 3, backgroundColor: "#FFFFFF", marginBottom: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}> Track a New Plant</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: 2, flexWrap: "wrap" }}>
            <FormControl sx={{ minWidth: "200px" }}>
              <InputLabel>Select Plant</InputLabel>
              <Select value={selectedPlant} onChange={(e) => setSelectedPlant(e.target.value)}>
                <MenuItem value="">Choose a Plant</MenuItem>
                {plants.map((plant) => (
                  <MenuItem key={plant.id} value={plant.id}>{plant.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Nickname (Optional)"
              variant="outlined"
              sx={{ minWidth: "200px" }}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />

            <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={handleAddPlant}>
              Add Plant
            </Button>
          </Box>
        </Paper>

        {/* Table Section */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#66BB6A" }}>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>Plant Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>Nickname</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>Date Added</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userPlants.map((plant) => (
                <TableRow key={plant.id}>
                  <TableCell>{plant.plant_name}</TableCell>
                  <TableCell>{plant.nickname || "N/A"}</TableCell>
                  <TableCell>{new Date(plant.date_added).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ display: 'flex', gap: 1 }}>
  {/* Growth Logs Button */}
  <Button
    size="small"
    variant="outlined"
    color="primary"
    onClick={() => navigate(`/growth-logs/${plant.id}`)}
  >
    Growth Logs
  </Button>

  {/* Health Monitoring Button */}
  <Button
  size="small"
  variant="outlined"
  color="secondary"
  sx={{
    color: 'green', 
    borderColor: 'green', 
    '&:hover': {
      backgroundColor: 'rgba(76, 175, 80, 0.1)', 
    }
  }}
  onClick={() => navigate(`/health-monitoring/${plant.id}`)}
>
  Health Monitoring
</Button>


  {/* Observations Button */}
  <Button
    size="small"
    variant="outlined"
    color="success"
    onClick={() => navigate(`/observations/${plant.id}`)}
  >
    Observations
  </Button>

  {/* Set Reminder Button */}
  <Button
    size="small"
    variant="outlined"
    color="warning"
    onClick={() => navigate(`/set-reminder/${plant.id}`)}
  >
    Set Reminder
  </Button>

  {/* Delete Icon Button */}
  <IconButton color="error" onClick={() => handleRemovePlant(plant.id)}>
    <DeleteIcon />
  </IconButton>
</TableCell>


                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default PlantTracking;
