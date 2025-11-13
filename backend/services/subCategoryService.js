const SubCategory = require("../models/SubCategoryModel");
const CounterModel = require("../models/CategoryCounterModel");
const slugify = require("slugify");

// Create a new subcategory
const createSubCategory = async (subCategoryData) => {
  try {
    // Auto-increment categoryId
    const counter = await CounterModel.findOneAndUpdate(
      { name: "SubCategory" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    subCategoryData.categoryId = counter.value;
    subCategoryData.slug = slugify(`${subCategoryData.name}-${subCategoryData.categoryId}`, { lower: true });

    const subCategory = await SubCategory.create(subCategoryData);
    return subCategory;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all subcategories
const getAllSubCategories = async () => {
  try {
    return await SubCategory.find().populate("category", "name").select("-createdAt -updatedAt");
  } catch (error) {
    throw new Error("Error fetching subcategories: " + error.message);
  }
};

// Get a single subcategory by ID
const getSubCategoryById = async (id) => {
  try {
    const subCategory = await SubCategory.findById(id).populate("category", "name").select("-createdAt -updatedAt");
    if (!subCategory) throw new Error("Subcategory not found");
    return subCategory;
  } catch (error) {
    throw new Error("Error fetching subcategory: " + error.message);
  }
};

// Update a subcategory
const updateSubCategory = async (id, updatedData) => {
  try {
    if (updatedData.name) {
      updatedData.slug = slugify(`${updatedData.name}-${id}`, { lower: true });
    }

    const subCategory = await SubCategory.findByIdAndUpdate(id, updatedData, { new: true })
      .populate("category", "name")
      .select("-createdAt -updatedAt");

    if (!subCategory) throw new Error("Subcategory not found");
    return subCategory;
  } catch (error) {
    throw new Error("Error updating subcategory: " + error.message);
  }
};

// Delete a subcategory
const deleteSubCategory = async (id) => {
  try {
    const subCategory = await SubCategory.findByIdAndDelete(id);
    if (!subCategory) throw new Error("Subcategory not found");
    return { message: "Subcategory deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting subcategory: " + error.message);
  }
};

module.exports = {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
