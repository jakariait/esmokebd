const subCategoryService = require("../services/subCategoryService");

// Create a new subcategory
const createSubCategory = async (req, res) => {
  try {
    const subCategory = await subCategoryService.createSubCategory(req.body);
    res.status(201).json({ message: "Subcategory created successfully", subCategory });
  } catch (error) {
    res.status(400).json({ message: "Error creating subcategory: " + error.message });
  }
};

// Get all subcategories
const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await subCategoryService.getAllSubCategories();
    res.status(200).json({ message: "Subcategories fetched successfully", subCategories });
  } catch (error) {
    res.status(400).json({ message: "Error fetching subcategories: " + error.message });
  }
};

// Get a single subcategory by ID
const getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await subCategoryService.getSubCategoryById(req.params.id);
    res.status(200).json({ message: "Subcategory fetched successfully", subCategory });
  } catch (error) {
    res.status(404).json({ message: "Error fetching subcategory: " + error.message });
  }
};

// Update a subcategory
const updateSubCategory = async (req, res) => {
  try {
    const subCategory = await subCategoryService.updateSubCategory(req.params.id, req.body);
    res.status(200).json({ message: "Subcategory updated successfully", subCategory });
  } catch (error) {
    res.status(400).json({ message: "Error updating subcategory: " + error.message });
  }
};

// Delete a subcategory
const deleteSubCategory = async (req, res) => {
  try {
    const response = await subCategoryService.deleteSubCategory(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ message: "Error deleting subcategory: " + error.message });
  }
};

module.exports = {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
