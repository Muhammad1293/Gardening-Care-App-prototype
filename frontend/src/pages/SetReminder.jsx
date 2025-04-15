import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";
import axios from "axios";

const SetReminder = () => {
  const { trackingId } = useParams();
  const navigate = useNavigate();

  const [reminderType, setReminderType] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [frequency, setFrequency] = useState("");

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/reminders/add`,
        {
          tracking_id: trackingId,
          reminder_type: reminderType,
          reminder_date: reminderDate,
          frequency,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Reminder set successfully!");
      navigate("/plant-tracking");
    } catch (error) {
      console.error("Error setting reminder:", error);
      alert("Failed to set reminder.");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
        <Typography variant="h5" gutterBottom>
          Set Reminder for Plant
        </Typography>

        <TextField
          fullWidth
          label="Reminder Type"
          select
          value={reminderType}
          onChange={(e) => setReminderType(e.target.value)}
          sx={{ my: 2 }}
        >
          <MenuItem value="Watering">Watering</MenuItem>
          <MenuItem value="Pruning">Pruning</MenuItem>
          <MenuItem value="Repotting">Repotting</MenuItem>
        </TextField>

        <TextField
          fullWidth
          type="date"
          label="Reminder Date"
          InputLabelProps={{ shrink: true }}
          value={reminderDate}
          onChange={(e) => setReminderDate(e.target.value)}
          sx={{ my: 2 }}
        />

        <TextField
          fullWidth
          label="Frequency (e.g. Weekly)"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          sx={{ my: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Save Reminder
        </Button>
      </Paper>
    </Box>
  );
};

export default SetReminder;
