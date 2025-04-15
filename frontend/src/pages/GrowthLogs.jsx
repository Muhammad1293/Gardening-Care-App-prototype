import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Box, Paper, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem,
  IconButton, Avatar, Menu, Button
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const GrowthLogs = () => {
  const navigate = useNavigate();
  const { trackingId } = useParams();
  const [trackedPlants, setTrackedPlants] = useState([]);
  const [growthLogs, setGrowthLogs] = useState([]);
  const [selectedTrackingId, setSelectedTrackingId] = useState("");
  const [height, setHeight] = useState("");
  const [growthStage, setGrowthStage] = useState("");
  const [observationDate, setObservationDate] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch on load
  useEffect(() => {
    fetchUserData();
    fetchTrackedPlants();
  }, []);

  // Track changes in trackingId from URL param
  useEffect(() => {
    if (trackingId) {
      setSelectedTrackingId(trackingId);
      fetchGrowthLogs(trackingId);
    }
  }, [trackingId]);

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

  const fetchGrowthLogs = async (trackingId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/growth-logs/${trackingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGrowthLogs(response.data);
    } catch (error) {
      console.error("Error fetching growth logs:", error);
    }
  };

  const handleAddGrowthLog = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/growth-logs/add",
        {
          tracking_id: selectedTrackingId,
          height,
          growth_stage: growthStage,
          observation_date: observationDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGrowthLogs((prev) => [...prev, response.data]);
      setHeight("");
      setGrowthStage("");
      setObservationDate("");
    } catch (error) {
      console.error("Error adding growth log:", error);
    }
  };

  const handleRemoveGrowthLog = async (logId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/growth-logs/remove/${logId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGrowthLogs(growthLogs.filter((log) => log.id !== logId));
    } catch (error) {
      console.error("Error removing growth log:", error);
    }
  };

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#E8F5E9" }}>
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppBar position="static" sx={{ backgroundColor: "green" }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
              Growth Logs
            </Typography>

            {user && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ cursor: "pointer", display: "flex", alignItems: "center" }} onClick={handleMenuClick}>
                  <Avatar sx={{ bgcolor: "#fff", color: "green" }}>
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                  <Box sx={{ ml: 1 }}>
                    <Typography sx={{ color: "white", fontWeight: "bold" }}>{user.username}</Typography>
                    <Typography sx={{ color: "white", fontSize: "12px" }}>{user.role}</Typography>
                  </Box>
                </Box>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/profile"); }}>
                    Update Profile
                  </MenuItem>
                </Menu>

                <IconButton onClick={handleLogout} sx={{ color: "white" }}>
                  <LogoutIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" fontWeight="bold"> Add Growth Log</Typography>
            <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Select Plant</InputLabel>
                <Select
                  value={selectedTrackingId}
                  onChange={(e) => {
                    setSelectedTrackingId(e.target.value);
                    fetchGrowthLogs(e.target.value);
                  }}
                  label="Select Plant"
                >
                  <MenuItem value="">Choose a Tracked Plant</MenuItem>
                  {trackedPlants.map((plant) => (
                    <MenuItem key={plant.id} value={plant.id}>{plant.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Height (cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                sx={{ minWidth: 150 }}
              />
              <TextField
                label="Growth Stage"
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                sx={{ minWidth: 150 }}
              />
              <TextField
                type="date"
                value={observationDate}
                onChange={(e) => setObservationDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 180 }}
              />

              <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={handleAddGrowthLog}>
                Add Log
              </Button>
            </Box>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#66BB6A" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Height</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Growth Stage</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {growthLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.height_cm}</TableCell>
                    <TableCell>{log.growth_stage}</TableCell>
                    <TableCell>{log.logged_at ? new Date(log.logged_at).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleRemoveGrowthLog(log.id)}>
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
    </Box>
  );
};

export default GrowthLogs;
