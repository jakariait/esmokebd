import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useProductSizeStore from "../../store/useProductSizeStore";
import {
  TextField,
  Button,
  Snackbar,
  CircularProgress,
} from "@mui/material";

const AddProductSize = () => {
  const { createProductSize, loading, error } = useProductSizeStore();
  const [name, setName] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const data = { name }; // Only sending 'name'

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setSnackbarMessage("Product size name is required");
      setOpenSnackbar(true);
      return;
    }

    try {
      await createProductSize(data); // Call to the store method
      setSnackbarMessage("Product size added successfully!");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/admin/product-sizes"), 2000); // Redirect after success
    } catch (err) {
      setSnackbarMessage(error || "Failed to add product size");
      setOpenSnackbar(true);
    }
  };

  return (
    <div className="p-4 shadow rounded-lg">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
        Add Product Size
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <TextField
          label="Product Size Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          fullWidth
          required
          error={!name}
          helperText={!name ? "Product size name is required" : ""}
        />

        <div className="flex justify-center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading ? "Saving..." : "Add Product Size"}
          </Button>
        </div>
      </form>

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

export default AddProductSize;
