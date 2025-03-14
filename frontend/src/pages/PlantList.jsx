import React, { useState, useEffect } from "react";
import { 
  Container, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField, 
  Select, 
  MenuItem 
} from "@mui/material";
import axios from "axios";

const PlantList = () => {
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState({ name: "", category: "" });
  const [newPlant, setNewPlant] = useState({ 
    name: "", 
    category: "", 
    characteristics: "", 
    care_requirements: "", 
    age: "", 
    growth_stage: "", 
    sunlight_requirements: "", 
    watering_frequency: "" 
  });

  // Fetch plants from backend
  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = () => {
    axios.get("http://localhost:5000/api/plants", { params: search })
      .then(res => setPlants(res.data))
      .catch(err => console.error("Error fetching plants:", err));
  };

  // Add a new plant
  const addPlant = () => {
    axios.post("http://localhost:5000/api/plants", newPlant)
      .then(res => {
        setPlants([...plants, res.data]);
        setNewPlant({ 
          name: "", 
          category: "", 
          characteristics: "", 
          care_requirements: "", 
          age: "", 
          growth_stage: "", 
          sunlight_requirements: "", 
          watering_frequency: "" 
        });
      })
      .catch(err => console.error("Error adding plant:", err));
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 5 }}>Plant Database</Typography>

      {/* Search Form */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <TextField 
          label="Search by Name" 
          value={search.name} 
          onChange={(e) => setSearch({ ...search, name: e.target.value })} 
          fullWidth 
          sx={{ mb: 2 }} 
        />
        <Select 
          value={search.category} 
          onChange={(e) => setSearch({ ...search, category: e.target.value })} 
          displayEmpty 
          fullWidth 
          sx={{ mb: 2 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          <MenuItem value="Flower">Flower</MenuItem>
          <MenuItem value="Vegetable">Vegetable</MenuItem>
          <MenuItem value="Fruit">Fruit</MenuItem>
        </Select>
        <Button variant="contained" onClick={fetchPlants}>Search</Button>
      </Paper>

      {/* Add Plant Form */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <TextField 
          label="Plant Name" 
          value={newPlant.name} 
          onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })} 
          fullWidth 
          sx={{ mb: 2 }} 
        />
        <Select 
          value={newPlant.category} 
          onChange={(e) => setNewPlant({ ...newPlant, category: e.target.value })} 
          displayEmpty 
          fullWidth 
          sx={{ mb: 2 }}
        >
          <MenuItem value="">Select Category</MenuItem>
          <MenuItem value="Flower">Flower</MenuItem>
          <MenuItem value="Vegetable">Vegetable</MenuItem>
          <MenuItem value="Fruit">Fruit</MenuItem>
        </Select>
        <TextField 
          label="Characteristics" 
          value={newPlant.characteristics} 
          onChange={(e) => setNewPlant({ ...newPlant, characteristics: e.target.value })} 
          fullWidth 
          sx={{ mb: 2 }} 
        />
        <TextField 
          label="Care Requirements" 
          value={newPlant.care_requirements} 
          onChange={(e) => setNewPlant({ ...newPlant, care_requirements: e.target.value })} 
          fullWidth 
          sx={{ mb: 2 }} 
        />
        <TextField 
          label="Age (years)" 
          type="number" 
          value={newPlant.age} 
          onChange={(e) => setNewPlant({ ...newPlant, age: e.target.value })} 
          fullWidth 
          sx={{ mb: 2 }} 
        />
        <TextField 
          label="Growth Stage" 
          value={newPlant.growth_stage} 
          onChange={(e) => setNewPlant({ ...newPlant, growth_stage: e.target.value })} 
          fullWidth 
          sx={{ mb: 2 }} 
        />
        <TextField 
          label="Sunlight Requirements" 
          value={newPlant.sunlight_requirements} 
          onChange={(e) => setNewPlant({ ...newPlant, sunlight_requirements: e.target.value })} 
          fullWidth 
          sx={{ mb: 2 }} 
        />
        <TextField 
          label="Watering Frequency (days)" 
          type="number" 
          value={newPlant.watering_frequency} 
          onChange={(e) => setNewPlant({ ...newPlant, watering_frequency: e.target.value })} 
          fullWidth 
          sx={{ mb: 2 }} 
        />
        <Button variant="contained" onClick={addPlant} sx={{ mt: 2 }}>Add Plant</Button>
      </Paper>

      {/* Plant List */}
      <TableContainer component={Paper} sx={{ mt: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Growth Stage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plants.map((plant) => (
              <TableRow key={plant.id}>
                <TableCell>{plant.name}</TableCell>
                <TableCell>{plant.category}</TableCell>
                <TableCell>{plant.age}</TableCell>
                <TableCell>{plant.growth_stage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PlantList;
