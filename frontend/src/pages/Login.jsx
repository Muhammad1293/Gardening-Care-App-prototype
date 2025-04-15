import React, { useState } from "react";
import { TextField, Button, Container, Typography, Paper, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(""); // Error state for login failure
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message before new request

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      setErrorMessage("Incorrect email or password. Please try again."); //  Show error message
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center", marginTop: 6, backgroundColor: "#f9fff3" }}>
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
           Gardening Care - Login
        </Typography>

        {/*  Display error message if login fails */}
        {errorMessage && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <TextField fullWidth label="Email" name="email" type="email" variant="outlined" margin="normal" onChange={handleChange} required />
          <TextField fullWidth label="Password" name="password" type="password" variant="outlined" margin="normal" onChange={handleChange} required />
          <Button type="submit" variant="contained" color="success" fullWidth sx={{ marginTop: 2 }}>
            Login
          </Button>
        </form>

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2">Don't have an account?</Typography>
          <Button onClick={() => navigate("/")} color="primary">
            Register here
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
