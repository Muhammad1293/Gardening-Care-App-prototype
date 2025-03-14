import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState({ username: "", email: "", role: "", gardening_preferences: "" });
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setProfile(res.data))
      .catch(err => console.error("Error fetching profile:", err));
    }
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({...profile, [e.target.name]: e.target.value});
  };

  const handleUpdate = () => {
    const token = localStorage.getItem("token");
    axios.put("http://localhost:5000/api/auth/profile", {
      username: profile.username,
      gardening_preferences: profile.gardening_preferences
    }, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
      alert("Profile updated successfully!");
      setEdit(false);
    })
    .catch(err => {
      alert("Failed to update profile");
      console.error(err);
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>User Profile</Typography>
        <TextField fullWidth label="Username" name="username" value={profile.username} onChange={handleChange} margin="normal" disabled={!edit} />
        <TextField fullWidth label="Email" name="email" value={profile.email} margin="normal" disabled />
        <TextField fullWidth label="Role" name="role" value={profile.role} margin="normal" disabled />
        <TextField fullWidth label="Gardening Preferences" name="gardening_preferences" value={profile.gardening_preferences} onChange={handleChange} margin="normal" disabled={!edit} />
        {edit ? (
          <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ mt: 2 }}>
            Save
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={() => setEdit(true)} sx={{ mt: 2 }}>
            Edit Profile
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default Profile;
