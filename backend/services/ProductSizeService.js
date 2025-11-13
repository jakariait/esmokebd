const ProductSizeModel = require('../models/ProductSizeModel');

const createProductSize = async (name, isActive = true) => { // Added isActive parameter with default value
  const productSize = new ProductSizeModel({ name, isActive }); // Ensure isActive is passed to the model
  return await productSize.save();
};

// Update Product Size by ID
const updateProductSize = async (id, name, isActive) => {
  return await ProductSizeModel.findByIdAndUpdate(id, { name, isActive }, { new: true });
};

// Get All Product Sizes
const getAllProductSizes = async () => {
  return await ProductSizeModel.find().select('-createdAt -updatedAt');
};

// Get Product Size by ID
const getProductSizeById = async (id) => {
  return await ProductSizeModel.findById(id).select('-createdAt -updatedAt');
};

// Delete Product Size by ID
const deleteProductSize = async (id) => {
  return await ProductSizeModel.findByIdAndDelete(id);
};

module.exports = {
  createProductSize,
  updateProductSize,
  getAllProductSizes,
  getProductSizeById,
  deleteProductSize
};
