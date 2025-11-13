const productSizeService = require('../services/ProductSizeService');

// Create Product Size
const createProductSize = async (req, res) => {
  try {
    const { name, isActive } = req.body; // Added isActive field
    if (!name) {
      return res.status(400).json({ message: "Product Size name is required" });
    }
    const newProductSize = await productSizeService.createProductSize(name, isActive); // Passing isActive to service
    return res.status(201).json({
      message: "Product Size created successfully",
      productSize: newProductSize
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while creating the product size", error: error.message });
  }
};

// Update Product Size by ID
const updateProductSize = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body; // Added isActive field
    if (!name) {
      return res.status(400).json({ message: "Product Size name is required" });
    }
    const updatedProductSize = await productSizeService.updateProductSize(id, name, isActive); // Passing isActive to service
    if (!updatedProductSize) {
      return res.status(404).json({ message: 'Product Size not found' });
    }
    return res.status(200).json({
      message: "Product Size updated successfully",
      productSize: updatedProductSize
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while updating the product size", error: error.message });
  }
};

// Get All Product Sizes
const getAllProductSizes = async (req, res) => {
  try {
    const productSizes = await productSizeService.getAllProductSizes();
    return res.status(200).json({
      message: "Product Sizes fetched successfully",
      productSizes
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while fetching the product sizes", error: error.message });
  }
};

// Get Product Size by ID
const getProductSizeById = async (req, res) => {
  try {
    const { id } = req.params;
    const productSize = await productSizeService.getProductSizeById(id);
    if (!productSize) {
      return res.status(404).json({ message: 'Product Size not found' });
    }
    return res.status(200).json({
      message: "Product Size fetched successfully",
      productSize
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while fetching the product size", error: error.message });
  }
};

// Delete Product Size by ID
const deleteProductSize = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProductSize = await productSizeService.deleteProductSize(id);
    if (!deletedProductSize) {
      return res.status(404).json({ message: 'Product Size not found' });
    }
    return res.status(200).json({
      message: 'Product Size deleted successfully',
      productSize: deletedProductSize
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while deleting the product size", error: error.message });
  }
};

module.exports = {
  createProductSize,
  updateProductSize,
  getAllProductSizes,
  getProductSizeById,
  deleteProductSize
};
