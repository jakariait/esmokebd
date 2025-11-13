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
import DeleteIcon from '@mui/icons-material/Delete';

const UpdateUserForm = ({ token }) => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const apiUrl = `${baseUrl}/profile`;
  const updateUrl = `${baseUrl}/updateUser`;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    userImage: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Auto clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setFetching(true);
      try {
        const res = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.user || res.data;
        setUserId(user._id);
        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          address: user.address || "",
          phone: user.phone || "",
          userImage: user?.userImage || null,
        });
        setPreviewImage(null);
        setImageRemoved(false);
      } catch (err) {
        setError("Failed to fetch user data.");
        console.error("Fetch user error:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [token, apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, userImage: file }));
      setPreviewImage(URL.createObjectURL(file));
      setImageRemoved(false);
    } else {
      setPreviewImage(null);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, userImage: null }));
    setPreviewImage(null);
    setImageRemoved(true);
  };

  const getImageSource = () => {
    let imageSrc = null;
    if (previewImage) {
      imageSrc = previewImage;
    } else if (formData.userImage && typeof formData.userImage === "string") {
      const staticBaseUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
      imageSrc = `${staticBaseUrl}/uploads/${formData.userImage}`;
    }
    return imageSrc;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!userId) {
      setError("User ID not available. Cannot update profile.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("address", formData.address);
      data.append("phone", formData.phone);

      if (imageRemoved) {
        data.append("userImage", "");
      } else if (formData.userImage instanceof File) {
        data.append("userImage", formData.userImage);
      }

      const res = await axios.put(`${updateUrl}/${userId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.message) {
        setSuccess(res.data.message);
        if (res.data.user && res.data.user.userImage) {
          setFormData((prev) => ({ ...prev, userImage: res.data.user.userImage }));
          setPreviewImage(null);
          setImageRemoved(false);
        } else if (imageRemoved) {
          setFormData((prev) => ({ ...prev, userImage: null }));
          setPreviewImage(null);
          setImageRemoved(false);
        }
      } else {
        setError("Failed to update user.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong during update.");
      console.error("Update user error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const currentImageSrc = getImageSource();

  return (
    <Paper sx={{ p: 4, maxWidth: 700, margin: "auto", borderRadius: 2 }}>
      <Typography variant="h5" mb={3} align="center" sx={{ fontWeight: 'bold' }}>
        Update Your Profile
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          {currentImageSrc ? (
            <img
              src={currentImageSrc}
              alt="User Profile"
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #fff',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/120x120/cccccc/333333?text=No+Image";
              }}
            />
          ) : (
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: '#e0e0e0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#757575',
                fontSize: '0.8rem',
                textAlign: 'center',
                border: '4px solid #fff',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
            >
              No Image
            </Box>
          )}
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <input
              accept="image/*"
              id="user-image-upload"
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="user-image-upload">
              <Button variant="contained" component="span" color="primary" sx={{ borderRadius: 2 }}>
                Upload Image
              </Button>
            </label>
            {(currentImageSrc || previewImage) && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleRemoveImage}
                sx={{ borderRadius: 2 }}
              >
                Remove Image
              </Button>
            )}
          </Box>
        </Box>

        <TextField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          sx={{ borderRadius: 2 }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          sx={{ borderRadius: 2 }}
        />
        <TextField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={2}
          sx={{ borderRadius: 2 }}
        />
        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
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
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Paper>
  );
};

export default UpdateUserForm;
