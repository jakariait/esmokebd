import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

const ChangePassword = ({ token }) => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const changePasswordUrl = `${baseUrl}/change-password`; // adjust to your real API path

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation: check new password matches confirm password
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (!formData.currentPassword || !formData.newPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.patch(
        changePasswordUrl,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data.message) {
        setSuccess(res.data.message);
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        setError("Failed to change password.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={"flex justify-center items-center"}>
      <div className={"p-4 shadow rounded-lg md:w-2/3 mt-10"}>
        <Typography
          variant="h5"
          mb={3}
          align="center"
          sx={{ fontWeight: "bold" }}
        >
          Change Password
        </Typography>

        {error && (
          <Typography color="error" mb={2} align="center">
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" mb={2} align="center">
            {success}
          </Typography>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Current Password"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ borderRadius: 2 }}
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ borderRadius: 2 }}
          />
          <TextField
            label="Confirm New Password"
            name="confirmNewPassword"
            type="password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ borderRadius: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            sx={{ mt: 3, py: 1, borderRadius: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
