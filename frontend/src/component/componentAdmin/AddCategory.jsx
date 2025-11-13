import React, { useState } from "react";
import axios from "axios";
import useAuthAdminStore from "../../store/AuthAdminStore.js";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AddCategory = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuthAdminStore();
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [name, setName] = useState("");
  const [featureCategory, setFeatureCategory] = useState(true);
  const [showOnNavbar, setShowOnNavbar] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the name field is empty
    if (!name.trim()) {
      setSnackbarMessage("Category name is required.");
      setOpenSnackbar(true);
      return;
    }

    // Prepare the data to send as JSON
    const categoryData = {
      name,
      featureCategory,
      showOnNavbar,
    };

    try {
      setIsLoading(true);
      const response = await axios.post(`${apiUrl}/category`, categoryData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Sending JSON data
        },
      });

      setSnackbarMessage("Category added successfully!");
      setOpenSnackbar(true);
      setName("");
      setFeatureCategory(true);
      setShowOnNavbar(true);

      // Wait for the snackbar message to appear
      setTimeout(() => {
        // Redirect to the subcategory list after a delay
        navigate("/admin/categorylist");
      }, 2000); // Delay in milliseconds (2 seconds
    } catch (error) {
      let errorMessage =
        "Error adding category: " +
        (error.response?.data?.message || error.message);
      if (
        error.response?.data?.message?.includes("E11000 duplicate key error")
      ) {
        errorMessage = "Duplicate entries not allowed";
      }
      setSnackbarMessage(errorMessage);
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 shadow rounded-lg">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
        Add New Category
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <TextField
              label="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              fullWidth
              required
              error={!name.trim()} // Show error if name is empty
              helperText={!name.trim() ? "Category name is required" : ""}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature Category */}
            <div className="space-y-2">
              <FormControl fullWidth>
                <InputLabel>Feature Category</InputLabel>
                <Select
                  value={featureCategory}
                  onChange={(e) =>
                    setFeatureCategory(e.target.value === "true")
                  }
                  label="Feature Category"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Show on Navbar */}
            <div className="space-y-2">
              <FormControl fullWidth>
                <InputLabel>Show on Navbar</InputLabel>
                <Select
                  value={showOnNavbar}
                  onChange={(e) => setShowOnNavbar(e.target.value === "true")}
                  label="Show on Navbar"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={
              isLoading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isLoading ? "Saving..." : "Save Category"}
          </Button>
        </div>
      </form>

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </div>
  );
};

export default AddCategory;