import React, { useState } from "react";
import useCategoryStore from "../../store/useCategoryStore.js";
import useSubCategoryStore from "../../store/useSubCategoryStore.js";
import useChildCategoryStore from "../../store/useChildCategoryStore.js";
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

const AddChildCategory = () => {
  const { categories, loading: categoryLoading } = useCategoryStore();
  const { subCategories, loading: subCategoryLoading } = useSubCategoryStore();
  const { createChildCategory } = useChildCategoryStore();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [childCategoryName, setChildCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();


  // Handle category selection change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedSubCategory(""); // Reset subcategory selection

    if (!categoryId) {
      setFilteredSubCategories([]);
      return;
    }

    // Filter subcategories based on selected category ID
    const filteredSubs = subCategories.filter(sub => sub.category._id === categoryId);
    setFilteredSubCategories(filteredSubs);
  };

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

    if (!selectedCategory || !selectedSubCategory || !childCategoryName) {
      showSnackbar("Please fill in all fields.", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      await createChildCategory({
        name: childCategoryName,
        category: selectedCategory,
        subCategory: selectedSubCategory,
      });

      showSnackbar("Child category created successfully!", "success");
      setChildCategoryName("");
      setSelectedCategory("");
      setSelectedSubCategory("");

      // Redirect to child category list after delay
      setTimeout(() => navigate("/admin/childcategorylist"), 2000);
    } catch (err) {
      showSnackbar("Failed to create child category. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (categoryLoading || subCategoryLoading) {
    return (
      <>
        <Skeleton height={100} width={"100%"} />
        <Skeleton height={50} width={"100%"} />
        <Skeleton height={100} width={"100%"} />
      </>
    );
  }

  return (
    <div>
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
          Add Child Category
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Category Selection */}
          <Box mb={2}>
            <Typography>Select Category</Typography>
            <Select fullWidth value={selectedCategory} onChange={handleCategoryChange}>
              <MenuItem value="">Select one</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Subcategory Selection */}
          <Box mb={2}>
            <Typography>Select Sub Category</Typography>
            <Select fullWidth value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.target.value)}>
              <MenuItem value="">Select one</MenuItem>
              {filteredSubCategories.length > 0 ? (
                filteredSubCategories.map((subCategory) => (
                  <MenuItem key={subCategory._id} value={subCategory._id}>
                    {subCategory.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No subcategories available</MenuItem>
              )}
            </Select>
          </Box>

          {/* Child Category Name Input */}
          <Box mb={2}>
            <Typography>Name</Typography>
            <TextField
              fullWidth
              placeholder="Child Category Name"
              value={childCategoryName}
              onChange={(e) => setChildCategoryName(e.target.value)}
            />
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Create Child Category"}
          </Button>
        </form>

        {/* Snackbar Notification */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
};

export default AddChildCategory;
