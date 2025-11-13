const childCategoryService = require("../services/childCategoryService");
const mongoose = require("mongoose");

// Create a new child category
const createChildCategory = async (req, res) => {
  try {
    const childCategoryData = req.body;

    if (!childCategoryData.name || !childCategoryData.category || !childCategoryData.subCategory) {
      return res.status(400).json({
        message: "Name, category, and subcategory are required fields.",
      });
    }

    const childCategory = await childCategoryService.createChildCategory(childCategoryData);
    res.status(201).json({
      message: "Child category created successfully",
      childCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating child category: " + error.message,
    });
  }
};

// Get all child categories
const getAllChildCategories = async (req, res) => {
  try {
    const childCategories = await childCategoryService.getAllChildCategories();
    if (!childCategories || childCategories.length === 0) {
      return res.status(404).json({
        message: "No child categories found",
      });
    }
    res.status(200).json({
      message: "Child categories fetched successfully",
      childCategories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching child categories: " + error.message,
    });
  }
};

// Get a single child category by ID
const getChildCategoryById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid child category ID",
    });
  }

  try {
    const childCategory = await childCategoryService.getChildCategoryById(id);
    if (!childCategory) {
      return res.status(404).json({
        message: `Child category with ID ${id} not found`,
      });
    }
    res.status(200).json({
      message: "Child category fetched successfully",
      childCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching child category: " + error.message,
    });
  }
};

// Update a child category
const updateChildCategory = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid child category ID",
    });
  }

  try {
    const childCategory = await childCategoryService.updateChildCategory(id, updatedData);
    if (!childCategory) {
      return res.status(404).json({
        message: `Child category with ID ${id} not found`,
      });
    }
    res.status(200).json({
      message: "Child category updated successfully",
      childCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating child category: " + error.message,
    });
  }
};

// Delete a child category
const deleteChildCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid child category ID",
    });
  }

  try {
    const response = await childCategoryService.deleteChildCategory(id);
    if (!response) {
      return res.status(404).json({
        message: `Child category with ID ${id} not found`,
      });
    }
    res.status(200).json({
      message: "Child category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting child category: " + error.message,
    });
  }
};

module.exports = {
  createChildCategory,
  getAllChildCategories,
  getChildCategoryById,
  updateChildCategory,
  deleteChildCategory,
};
