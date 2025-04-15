import React, { useState, useEffect } from "react";
import { Box, AppBar, Toolbar, Typography, Paper, TextField, Button, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
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

  useEffect(() => {
    fetchTrackedPlants();
    if (trackingId) {
      setSelectedTrackingId(trackingId);
      fetchHealthData(trackingId);
    }
  }, [trackingId]);

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

  const fetchHealthData = async (trackingId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/health-monitoring/${trackingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHealthData(response.data);
    } catch (error) {
      console.error("Error fetching health data:", error);
    }
  };

  const handleAddHealthData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/health-monitoring/add",
        {
          tracking_id: selectedTrackingId,
          moisture_level: moistureLevel,
          pest_presence: pestPresence,
          nutrient_deficiency: nutrientDeficiency,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHealthData([...healthData, response.data]);
      setMoistureLevel("");
      setPestPresence("");
      setNutrientDeficiency("");
    } catch (error) {
      console.error("Error adding health data:", error);
    }
  };

  const handleRemoveHealthData = async (dataId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/health-monitoring/remove/${dataId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHealthData(healthData.filter((data) => data.id !== dataId));
    } catch (error) {
      console.error("Error removing health data:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#E8F5E9" }}>
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppBar position="static" sx={{ backgroundColor: "green" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
              Health Monitoring
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ padding: 3 }}>
          <Paper sx={{ padding: 3, backgroundColor: "#FFFFFF", marginBottom: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>🌱 Add Health Data</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: 2, flexWrap: "wrap" }}>
              <FormControl sx={{ minWidth: "200px" }}>
                <InputLabel>Select Plant</InputLabel>
                <Select
                  value={selectedTrackingId}
                  onChange={(e) => {
                    setSelectedTrackingId(e.target.value);
                    fetchHealthData(e.target.value);
                  }}
                >
                  <MenuItem value="">Choose a Tracked Plant</MenuItem>
                  {trackedPlants.map((plant) => (
                    <MenuItem key={plant.id} value={plant.id}>{plant.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField label="Moisture Level" value={moistureLevel} onChange={(e) => setMoistureLevel(e.target.value)} sx={{ minWidth: "150px" }} />
              <TextField label="Pest Presence" value={pestPresence} onChange={(e) => setPestPresence(e.target.value)} sx={{ minWidth: "150px" }} />
              <TextField label="Nutrient Deficiency" value={nutrientDeficiency} onChange={(e) => setNutrientDeficiency(e.target.value)} sx={{ minWidth: "150px" }} />

              <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={handleAddHealthData}>
                Add Data
              </Button>
            </Box>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#66BB6A" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Moisture Level</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Pest Presence</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Nutrient Deficiency</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {healthData.map((data) => (
                  <TableRow key={data.id}>
                    <TableCell>{data.moisture_level}</TableCell>
                    <TableCell>{data.pest_presence}</TableCell>
                    <TableCell>{data.nutrient_deficiency}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleRemoveHealthData(data.id)}>
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
