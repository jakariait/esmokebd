import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useCategoryStore from "../../store/useCategoryStore.js";
import useSubCategoryStore from "../../store/useSubCategoryStore.js";
import useChildCategoryStore from "../../store/useChildCategoryStore.js";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Snackbar,
  CircularProgress,
  FormControl,
  InputLabel,
} from "@mui/material";

const EditChildCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { categories, fetchCategories } = useCategoryStore();
  const { subCategories, fetchSubCategories } = useSubCategoryStore();
  const { selectedChildCategory, fetchChildCategoryById, updateChildCategory, loading } = useChildCategoryStore();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [childCategoryName, setChildCategoryName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchChildCategoryById(id);
  }, [id]);

  useEffect(() => {
    if (selectedChildCategory && selectedChildCategory.childCategory && Object.keys(selectedChildCategory.childCategory).length > 0) {
      const childCategoryData = selectedChildCategory.childCategory;

      setChildCategoryName(childCategoryData.name || "");

      const categoryId = categories.find(cat => cat.name === childCategoryData.category.name)?._id;
      const subCategoryId = subCategories.find(sub => sub.name === childCategoryData.subCategory.name)?._id;

      setSelectedCategory(categoryId || "");
      setSelectedSubCategory(subCategoryId || "");
      setIsActive(childCategoryData.isActive);
    }
  }, [selectedChildCategory, categories, subCategories]);

  useEffect(() => {
    if (selectedCategory) {
      const filteredSubs = subCategories.filter(sub => sub.category._id === selectedCategory);
      setFilteredSubCategories(filteredSubs);
    }
  }, [selectedCategory, subCategories]);

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedCategory || !selectedSubCategory || !childCategoryName) {
      showSnackbar("Please fill in all fields.");
      setIsSubmitting(false);
      return;
    }

    console.log("isActive value before submission:", isActive); // Debugging line

    try {
      await updateChildCategory(id, {
        name: childCategoryName,
        category: selectedCategory,
        subCategory: selectedSubCategory,
        isActive, // This should now be a boolean value
      });

      showSnackbar("Child category updated successfully!");
      setTimeout(() => navigate("/admin/childcategorylist"), 2000);
    } catch (err) {
      let errorMessage = "Failed to update child category. Please try again.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      showSnackbar(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (!selectedChildCategory) return null;

  return (
    <div className="p-4 shadow rounded-lg">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
        Edit Child Category
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <TextField
              label="Child Category Name"
              value={childCategoryName || ""}
              onChange={(e) => setChildCategoryName(e.target.value)}
              variant="outlined"
              fullWidth
              required
              error={!childCategoryName}
              helperText={!childCategoryName ? "Child category name is required" : ""}
            />
          </div>

          <div className="space-y-2">
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">Select a Category</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl fullWidth>
              <InputLabel>Sub Category</InputLabel>
              <Select
                value={selectedSubCategory || ""}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                label="Sub Category"
              >
                <MenuItem value="">Select a Sub Category</MenuItem>
                {filteredSubCategories.length > 0 ? (
                  filteredSubCategories.map((subCat) => (
                    <MenuItem key={subCat._id} value={subCat._id}>
                      {subCat.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No subcategories available</MenuItem>
                )}
              </Select>
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl fullWidth>
              <InputLabel>Active</InputLabel>
              <Select
                value={isActive}
                onChange={(e) => setIsActive(e.target.value === true)}
                label="Active"
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSubmitting ? "Saving..." : "Save Child Category"}
          </Button>
        </div>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </div>
  );
};

export default EditChildCategory;
