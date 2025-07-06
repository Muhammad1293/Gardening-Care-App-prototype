import React, { useState, useEffect } from "react";
import {
  Box, AppBar, Toolbar, Typography, Paper, FormControl,
  InputLabel, Select, MenuItem, TextField, Button,
  Table, TableContainer, TableHead, TableRow, TableCell,
  TableBody, IconButton, Avatar, Menu
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const HealthMonitoring = () => {
  const navigate = useNavigate();
  const { trackingId } = useParams();

  const [trackedPlants, setTrackedPlants] = useState([]);
  const [healthData, setHealthData] = useState([]);
  const [moistureLevel, setMoistureLevel] = useState("");
  const [pestPresence, setPestPresence] = useState("");
  const [nutrientDeficiency, setNutrientDeficiency] = useState("");
  const [selectedTrackingId, setSelectedTrackingId] = useState("");

  // Added for profile, logout, and notifications
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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

  const moistureOptions = ["Low", "Medium", "High"];
  const nutrientOptions = [
    "None", "Nitrogen Deficiency", "Phosphorus Deficiency", "Potassium Deficiency", "Multiple Deficiencies"
  ];

  useEffect(() => {
    fetchUserData();
    fetchTrackedPlants();
    if (trackingId) {
      setSelectedTrackingId(trackingId);
      fetchHealthData(trackingId);
    }
  }, [trackingId]);

  const fetchTrackedPlants = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/plant-tracking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrackedPlants(res.data);
    } catch (err) {
      console.error("Error fetching tracked plants:", err);
    }
  };

  const fetchHealthData = async (tid) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/health-monitoring/${tid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHealthData(res.data);
    } catch (err) {
      console.error("Error fetching health data:", err);
    }
  };

  const handleAddHealthData = async () => {
    if (!selectedTrackingId || !moistureLevel || !pestPresence) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/health-monitoring/add",
        {
          tracking_id: selectedTrackingId,
          moisture_level: moistureLevel,
          pest_presence: pestPresence,
          nutrient_deficiency: nutrientDeficiency,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHealthData([res.data, ...healthData]);
      setMoistureLevel(""); setPestPresence(""); setNutrientDeficiency("");
    } catch (err) {
      console.error("Error adding health data:", err);
    }
  };

  const handleRemoveHealthData = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/health-monitoring/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHealthData(healthData.filter(item => item.id !== id));
    } catch (err) {
      console.error("Error deleting health data:", err);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#E8F5E9" }}>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AppBar position="static" sx={{ backgroundColor: "green" }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
              Health Monitoring
            </Typography>

            {user && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* Notification Bell */}
                <IconButton onClick={() => navigate("/notifications")} sx={{ color: "white" }}>
                  <Badge badgeContent={0} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* Profile Avatar */}
                <Box sx={{ cursor: "pointer", display: "flex", alignItems: "center" }} onClick={handleMenuClick}>
                  <Avatar sx={{ bgcolor: "#ffffff", color: "green" }}>
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
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Add Health Data
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Select Plant</InputLabel>
                <Select
                  value={selectedTrackingId}
                  onChange={(e) => {
                    setSelectedTrackingId(e.target.value);
                    fetchHealthData(e.target.value)
                  }}
                  label="Select Plant"
                >
                  <MenuItem value="">Choose Plant</MenuItem>
                  {trackedPlants.map(p => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.plant_name || p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Moisture Level</InputLabel>
                <Select
                  value={moistureLevel}
                  onChange={(e) => setMoistureLevel(e.target.value)}
                  label="Moisture Level"
                >
                  <MenuItem value="">Select</MenuItem>
                  {moistureOptions.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Pest?</InputLabel>
                <Select
                  value={pestPresence}
                  onChange={(e) => setPestPresence(e.target.value)}
                  label="Pest?"
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Nutrient Deficiency</InputLabel>
                <Select
                  value={nutrientDeficiency}
                  onChange={(e) => setNutrientDeficiency(e.target.value)}
                  label="Nutrient Deficiency"
                >
                  <MenuItem value="">Select</MenuItem>
                  {nutrientOptions.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={handleAddHealthData}
                sx={{ height: 56 }}
              >
                Add Data
              </Button>
            </Box>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#66BB6A" }}>
                  {["Moisture", "Pest", "Nutrient Deficiency", "Recorded At", "Actions"].map(col => (
                    <TableCell key={col} sx={{ fontWeight: "bold", color: "white" }}>{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {healthData.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.moisture_level}</TableCell>
                    <TableCell>{item.pest_presence ? "Yes" : "No"}</TableCell>
                    <TableCell>{item.nutrient_deficiency || "-"}</TableCell>
                    <TableCell>{new Date(item.recorded_at || item.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleRemoveHealthData(item.id)}>
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

export default HealthMonitoring;
