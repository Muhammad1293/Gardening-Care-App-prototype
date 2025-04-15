import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Box, Paper, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem, IconButton, Avatar, Menu, Button
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Observations = () => {
  const navigate = useNavigate();
  const [trackedPlants, setTrackedPlants] = useState([]);
  const [observations, setObservations] = useState([]);
  const [selectedTrackingId, setSelectedTrackingId] = useState("");
  const [note, setNote] = useState("");
  const [observationDate, setObservationDate] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchTrackedPlants();
  }, []);

  // Fetch User Data
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

  // Fetch user's tracked plants
  const fetchTrackedPlants = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/plant-tracking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrackedPlants(response.data);
    } catch (error) {
      console.error("Error fetching tracked plants:", error);
    }
  };

  // Fetch observations for selected plant
  const fetchObservations = async (trackingId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/observations/${trackingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setObservations(response.data);
    } catch (error) {
      console.error("Error fetching observations:", error);
    }
  };

  // Add a new observation entry
  const handleAddObservation = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/observations/add",
        { tracking_id: selectedTrackingId, note, observation_date: observationDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setObservations([...observations, response.data]);
      setNote("");
      setObservationDate("");
    } catch (error) {
      console.error("Error adding observation:", error);
    }
  };

  // Remove an observation entry
  const handleRemoveObservation = async (observationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/observations/remove/${observationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setObservations(observations.filter((obs) => obs.id !== observationId));
    } catch (error) {
      console.error("Error removing observation:", error);
    }
  };

  // Handle Profile Dropdown
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Logout User
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#E8F5E9" }}>
    
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/*  Fixed Header */}
        <AppBar position="static" sx={{ backgroundColor: "green" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
              Plant Observations
            </Typography>

            {/* Profile Section */}
            {user && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={handleMenuClick}>
                  <Avatar sx={{ bgcolor: "#ffffff", color: "green", width: 40, height: 40 }}>
                    {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                  <Box sx={{ marginLeft: 1 }}>
                    <Typography sx={{ color: "white", fontWeight: "bold" }}>{user.username || "User"}</Typography>
                    <Typography sx={{ color: "white", fontSize: "12px" }}>{user.role || "Role"}</Typography>
                  </Box>
                </Box>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/profile"); }}>Update Profile</MenuItem>
                </Menu>

                <IconButton onClick={handleLogout} sx={{ color: "white" }}>
                  <LogoutIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        {/*  Content Section */}
        <Box sx={{ padding: 3 }}>
          {/* Add Observation Section */}
          <Paper sx={{ padding: 3, backgroundColor: "#FFFFFF", marginBottom: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>📋 Add Plant Observation</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: 2, flexWrap: "wrap" }}>
              <FormControl sx={{ minWidth: "200px" }}>
                <InputLabel>Select Plant</InputLabel>
                <Select value={selectedTrackingId} onChange={(e) => {
                  setSelectedTrackingId(e.target.value);
                  fetchObservations(e.target.value);
                }}>
                  <MenuItem value="">Choose a Tracked Plant</MenuItem>
                  {trackedPlants.map((plant) => (
                    <MenuItem key={plant.id} value={plant.id}>{plant.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField label="Observation Note" variant="outlined" sx={{ minWidth: "250px" }} value={note} onChange={(e) => setNote(e.target.value)} />
              <TextField label="Date" type="date" variant="outlined" sx={{ minWidth: "200px" }} value={observationDate} onChange={(e) => setObservationDate(e.target.value)} InputLabelProps={{ shrink: true }} />

              <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={handleAddObservation}>
                Add Observation
              </Button>
            </Box>
          </Paper>

          {/* Observations Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#66BB6A" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Observation Note</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Observations;
