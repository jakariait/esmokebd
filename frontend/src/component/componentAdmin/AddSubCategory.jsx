import React, { useEffect, useState } from "react";
import useCategoryStore from "../../store/useCategoryStore.js";
import useSubCategoryStore from "../../store/useSubCategoryStore"; // Import the subcategory store
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const AddSubCategory = () => {
  const { categories, loading, error, fetchCategories } = useCategoryStore();
  const { createSubCategory } = useSubCategoryStore(); // Access createSubCategory from the store
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchCategories();
  }, []);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedCategory || !subCategoryName) {
      showSnackbar("Please select a category and enter a name.", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      await createSubCategory({
        name: subCategoryName,
        category: selectedCategory,
      });
      showSnackbar("Subcategory created successfully!", "success");
      setSubCategoryName("");
      setSelectedCategory("");

      setTimeout(() => {
        navigate("/admin/subcategorylist");
      }, 2000);
    } catch (err) {
      showSnackbar("Failed to create subcategory. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      {loading ? (
        <>
          <Skeleton height={100} width={"100%"} />
          <Skeleton height={50} width={"100%"} />
          <Skeleton height={100} width={"100%"} />
        </>
      ) : (
        <>
          <Box
            sx={{
              mx: "auto",
              p: 4,
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: 3,
              mt: 4,
            }}
          >
            <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
              Add Sub Category
            </h1>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <Typography>Select Category</Typography>
                <Select
                  fullWidth
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="">Select one</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Box mb={2}>
                <Typography>Name</Typography>
                <TextField
                  fullWidth
                  placeholder="Sub Category Name"
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                />
              </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Create Sub Category"}
                </Button>
            </form>

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={handleSnackbarClose}
                severity={snackbarSeverity}
                sx={{ width: "100%" }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Box>
        </>
      )}
    </div>
  );
};

export default AddSubCategory;
