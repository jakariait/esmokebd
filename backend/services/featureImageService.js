const FeatureImageModel = require("../models/FeatureImageModel");

// Create a new feature image
const createFeatureImage = async (title, imgSrc) => {
  return await FeatureImageModel.create({ title, imgSrc });
};

// Get all feature images
const getAllFeatureImages = async () => {
  return await FeatureImageModel.find().select('-createdAt -updatedAt');
};

// Get a single feature image by ID
const getFeatureImageById = async (id) => {
  const featureImage = await FeatureImageModel.findById(id);
  if (!featureImage) {
    throw new Error("Feature image not found");
  }
  return featureImage;
};

// Update a feature image
const updateFeatureImage = async (id, title, imgSrc) => {
  // Prepare the update data
  const updateData = {};

  // Update the title if provided
  if (title) {
    updateData.title = title;
  }

  // Update the image source if provided
  if (imgSrc) {
    updateData.imgSrc = imgSrc; // Store only the filename
  }

  // If no update data is provided, throw an error
  if (Object.keys(updateData).length === 0) {
    throw new Error("No data provided for update");
  }

  // Perform the update
  const updatedFeatureImage = await FeatureImageModel.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    },
  );

  // If no feature image is found, throw an error
  if (!updatedFeatureImage) {
    throw new Error("Feature image not found");
  }

  // Return the updated feature image
  return updatedFeatureImage;
};

// Delete a feature image
const deleteFeatureImage = async (id) => {
  const deletedFeatureImage = await FeatureImageModel.findByIdAndDelete(id);
  if (!deletedFeatureImage) {
    throw new Error("Feature image not found");
  }
  return deletedFeatureImage;
};

module.exports = {
  createFeatureImage,
  getAllFeatureImages,
  getFeatureImageById,
  updateFeatureImage,
  deleteFeatureImage,
};
