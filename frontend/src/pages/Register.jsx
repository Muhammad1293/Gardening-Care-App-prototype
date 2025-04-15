import React, { useState } from "react";
import { TextField, Button, Container, Typography, Paper, MenuItem, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const roles = ["Gardener", "Supervisor", "Homeowner", "System Admin"];

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    // Basic validation to check proper email format
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    if (!formData.role) {
      setMessage({ type: "error", text: "Please select a role." });
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      setMessage({ type: "success", text: "Registration successful! Redirecting to login..." });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Registration failed. Try again." });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center", marginTop: 6, backgroundColor: "#f9fff3" }}>
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
           Gardening Care - Register
        </Typography>

        {message.text && <Alert severity={message.type} sx={{ marginBottom: 2 }}>{message.text}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            select
            label="Select Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            margin="normal"
            required
          >
            <MenuItem value="" >Select your role</MenuItem>
            {roles.map((role) => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="success" fullWidth sx={{ marginTop: 2 }}>
            Register
          </Button>
        </form>

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2">Already have an account?</Typography>
          <Button onClick={() => navigate("/login")} color="primary">
            Login here
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
