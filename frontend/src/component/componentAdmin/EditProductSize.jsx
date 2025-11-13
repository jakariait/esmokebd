import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProductSizeStore from '../../store/useProductSizeStore';
import {
  TextField,
  Button,
  Snackbar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const EditProductSize = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedProductSize, fetchProductSizeById, updateProductSize, loading, error } = useProductSizeStore();

  // Local state to handle form input values
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true); // Default to active status
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Fetch product size by ID when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      await fetchProductSizeById(id); // Fetch the product size data
    };
    fetchData();
  }, [fetchProductSizeById, id]);

  // Set initial values for name and isActive when selectedProductSize changes
  useEffect(() => {
    if (selectedProductSize) {
      setName(selectedProductSize.name);
      setIsActive(selectedProductSize.isActive); // Ensure isActive is a boolean
    }
  }, [selectedProductSize]);

  // Handle form submission to update the product size
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setSnackbarMessage('Product size name is required');
      setOpenSnackbar(true);
      return;
    }

    const data = { name, isActive }; // Data to be sent to the backend
    try {
      await updateProductSize(id, data); // Update product size
      setSnackbarMessage('Product size updated successfully!');
      setOpenSnackbar(true);

      // Delay the redirect to show Snackbar
      setTimeout(() => {
        navigate('/admin/product-sizes');
      }, 3000);
    } catch (err) {
      setSnackbarMessage(error || 'Failed to update product size');
      setOpenSnackbar(true);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedProductSize) {
    return <div>No product size found for the provided ID.</div>;
  }

  return (
    <div className="p-4 shadow rounded-lg">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
        Edit Product Size
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col gap-5">
        {/* Product Size Name */}
        <TextField
          label="Product Size Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          fullWidth
          required
          error={!name}
          helperText={!name ? 'Product size name is required' : ''}
        />

        {/* Status Select */}
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={isActive ? 'true' : 'false'} // Convert boolean to string for Select component
            onChange={(e) => setIsActive(e.target.value === 'true')} // Ensure it's boolean
            label="Status"
          >
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </Select>
        </FormControl>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Saving...' : 'Update Product Size'}
          </Button>
        </div>
      </form>

      {/* Snackbar for showing messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    </div>
  );
};

export default EditProductSize;
