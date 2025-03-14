import React, { useState } from "react";
import { Box, Container, Grid, TextField, Button, Typography, Link } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.msg || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "white",
            textAlign: "center",
          }}
        >
          {/* App Title */}
          <Typography variant="h3" sx={{ color: "#4caf50", mb: 2 }}>
            Gardening Care App
          </Typography>
          {/* Page Subtitle */}
          <Typography variant="h5" sx={{ mb: 3 }}>
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <Grid container spacing={2}>
              {/* Email Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={credentials.email}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              {/* Password Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              {/* Submit Button */}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Login
                </Button>
              </Grid>
            </Grid>
          </form>
          {/* Registration Link */}
          <Typography variant="body2" sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <Link href="/" underline="hover" sx={{ color: "#4caf50" }}>
              Register here
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
