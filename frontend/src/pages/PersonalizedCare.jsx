import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, IconButton, Box, Paper, TextField, MenuItem, Autocomplete, Alert,
  FormControl, InputLabel, Select, Menu, Avatar, Drawer, List, ListItem, ListItemIcon,
  ListItemText, Divider, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import SpaIcon from "@mui/icons-material/Spa";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PersonalizedCare = () => {
  const navigate = useNavigate();
  const locationObj = useLocation();

  const [selectedPlant, setSelectedPlant] = useState("");
  const [location, setLocation] = useState("");
  const [climate, setClimate] = useState("");
  const [soilType, setSoilType] = useState("");
  const [locations, setLocations] = useState([]);
  const [climates, setClimates] = useState([]);
  const [soilTypes, setSoilTypes] = useState([]);
  const [plants, setPlants] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);

  const toggleDrawer = (open) => () => setDrawerOpen(open);
  const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setUser(data);
        setLocation(data.location || "");
        setClimate(data.climate || "");
        setSoilType(data.soil_type || "");
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/plant-care/locations");
        setLocations(res.data.locations || []);
        setClimates(res.data.climates || []);
        setSoilTypes(res.data.soilTypes || []);
      } catch (err) {
        console.error("Error fetching dropdowns:", err);
      }
    };
    fetchDropdownData();
  }, []);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/plant-care/auto-suggest", {
          params: { location, climate, soil_type: soilType },
        });
        console.log(" Suggested plants:", res.data);
        setPlants(res.data || []);
      } catch (err) {
        console.error("Error fetching plants:", err);
      }
    };
    if (location && climate && soilType) {
      console.log("🔥 fetchPlants called with:", { location, climate, soilType });
      fetchPlants();
    }
  }, [location, climate, soilType]);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/plant-care/recommendations", {
        headers: { Authorization: `Bearer ${token}` },
        params: { plant: selectedPlant, location, climate, soil_type: soilType },
      });
      console.log(" Recommendations:", res.data);
      setRecommendations(res.data.length ? res.data : []);
      setErrorMessage(res.data.length ? "" : "No recommendations found.");
    } catch (err) {
      console.error("Error searching:", err);
      setErrorMessage("Something went wrong.");
    }
  };

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", backgroundColor: "#E8F5E9" }}>
      {/* Header */}
      <AppBar position="fixed" sx={{ backgroundColor: "green" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)} sx={{ color: "white"}}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "white" }}>Personalized Plant Care</Typography>
          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box onClick={handleMenuClick} sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#ffffff", color: "green" }}>
                  {user.username?.charAt(0).toUpperCase() || "U"}
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
          <ListItem
  button
  onClick={() => navigate("/dashboard")}
  sx={{
    cursor: 'pointer',
    backgroundColor: locationObj.pathname === '/dashboard' ? '#e8f5e9' : 'inherit',
    '&:hover': {
      backgroundColor: '#e8f5e9'
    }
  }}
>
  <ListItemIcon>
    <LocalFloristIcon sx={{ color: locationObj.pathname === '/dashboard' ? 'green' : 'inherit' }} />
  </ListItemIcon>
  <ListItemText
    primary="Search Plants"
    sx={{
      
      color: locationObj.pathname === '/dashboard' ? 'green' : 'inherit',
      fontWeight: locationObj.pathname === '/dashboard' ? 'bold' : 'normal'
    }}
  />
</ListItem>

<ListItem
  button
  onClick={() => navigate("/personalized-care")}
  sx={{
    cursor: 'pointer',
    backgroundColor: locationObj.pathname === '/personalized-care' ? '#e8f5e9' : 'inherit',
    '&:hover': {
      backgroundColor: '#e8f5e9'
    }
  }}
>
  <ListItemIcon>
    <SpaIcon sx={{ color: locationObj.pathname === '/personalized-care' ? 'green' : 'inherit' }} />
  </ListItemIcon>
  <ListItemText
    primary="Personalized Care"
    sx={{
      color: locationObj.pathname === '/personalized-care' ? 'green' : 'inherit',
      fontWeight: locationObj.pathname === '/personalized-care' ? 'bold' : 'normal'
    }}
  />
</ListItem>

<ListItem
  button
  onClick={() => navigate("/plant-tracking")}
  sx={{
    cursor: 'pointer',
    backgroundColor: locationObj.pathname === '/plant-tracking' ? '#e8f5e9' : 'inherit',
    '&:hover': {
      backgroundColor: '#e8f5e9'
    }
  }}
>
 <ListItemIcon>
  <TrackChangesIcon sx={{ color: locationObj.pathname === '/plant-tracking' ? 'green' : 'inherit' }} />
  </ListItemIcon>
      <ListItemText
    primary="Plant Tracking"
    sx={{
      color: locationObj.pathname === '/plant-tracking' ? 'green' : 'inherit',
      fontWeight: locationObj.pathname === '/plant-tracking' ? 'bold' : 'normal'
    }}
  />
              </ListItem>
          </List>
          <Divider />
        </Box>
      </Drawer>

      <Toolbar />

      {/* Content */}
      <Box sx={{ padding: 3 }}>
        <Paper sx={{ padding: 3 }}>
          <Typography variant="h6" fontWeight="bold"> Get Personalized Recommendations</Typography>
          {errorMessage && <Alert severity="error" sx={{ marginTop: 2 }}>{errorMessage}</Alert>}
          <Box sx={{ display: "flex", gap: 2, marginTop: 2, flexWrap: "wrap" }}>
            <Autocomplete
              options={plants}
              getOptionLabel={(option) => option}
              value={selectedPlant || null}
              onChange={(e, val) => setSelectedPlant(val || "")}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => <TextField {...params} label="Search & Select Plant" />}
              sx={{ minWidth: 300, backgroundColor: "#fff" }}
            />
            <Autocomplete
              options={locations}
              getOptionLabel={(option) => option}
              value={location}
              onChange={(e, val) => setLocation(val)}
              renderInput={(params) => <TextField {...params} label="Select Location" />}
              sx={{ minWidth: 300, backgroundColor: "#fff" }}
            />
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel>Climate</InputLabel>
              <Select value={climate} onChange={(e) => setClimate(e.target.value)} label="Climate">
                {climates.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel>Soil Type</InputLabel>
              <Select value={soilType} onChange={(e) => setSoilType(e.target.value)} label="Soil Type">
                {soilTypes.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
            <Button variant="contained" startIcon={<SearchIcon />} color="success" onClick={handleSearch}>
              Get Recommendations
            </Button>
          </Box>

          {/* Recommendations Table */}
          {recommendations.length > 0 && (
            <Box sx={{ marginTop: 4 }}>
              <Typography variant="h6" fontWeight="bold"> Recommended Care</Typography>
              <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#66BB6A" }}>
                      <TableCell sx={{ fontWeight: "bold", color: "white" }}>Plant</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "white" }}>Watering</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "white" }}>Fertilization</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "white" }}>Pest Control</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recommendations.map((rec, index) => (
                      <TableRow key={index}>
                        <TableCell>{rec.plant_name}</TableCell>
                        <TableCell>{rec.watering_schedule}</TableCell>
                        <TableCell>{rec.fertilization_plan}</TableCell>
                        <TableCell>{rec.pest_control}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default PersonalizedCare;
