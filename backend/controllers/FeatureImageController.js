const featureImageService = require("../services/featureImageService");

// Controller for creating a feature image
const createFeatureImage = async (req, res) => {
  try {
    const { title } = req.body;

    // Check if a file was uploaded
    if (!req.files || !req.files.imgSrc) {
      throw new Error("Image file is required");
    }

    // Get the filename of the uploaded file
    const imgSrc = req.files.imgSrc[0].filename;

    // Call the service function to create a feature image
    const newFeatureImage = await featureImageService.createFeatureImage(title, imgSrc);

    // Send success response
    res.status(201).json({
      success: true,
      message: "Feature image created successfully",
      data: newFeatureImage,
    });
  } catch (error) {
    // Handle errors
    res.status(400).json({ success: false, message: error.message });
  }
};

// Controller for getting all feature images
const getAllFeatureImages = async (req, res) => {
  try {
    // Call the service function to get all feature images
    const featureImages = await featureImageService.getAllFeatureImages();

    // Send success response
    res.status(200).json({
      success: true,
      message: "Feature images retrieved successfully",
      data: featureImages,
    });
  } catch (error) {
    // Handle errors
    res.status(400).json({ success: false, message: error.message });
  }
};

// Controller for getting a feature image by ID
const getFeatureImageById = async (req, res) => {
  try {
    const { id } = req.params;

    // Call the service function to get a feature image by ID
    const featureImage = await featureImageService.getFeatureImageById(id);

    // Send success response
    res.status(200).json({
      success: true,
      message: "Feature image retrieved successfully",
      data: featureImage,
    });
  } catch (error) {
    // Handle errors
    if (error.message === "Feature image not found") {
      res.status(404).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

// Controller for updating a feature image
const updateFeatureImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, imgSrc } = req.body;

    // Call the service function to update a feature image
    const updatedFeatureImage = await featureImageService.updateFeatureImage(id, title, imgSrc);

    // Send success response
    res.status(200).json({
      success: true,
      message: "Feature image updated successfully",
      data: updatedFeatureImage,
    });
  } catch (error) {
    // Handle errors
    if (error.message === "Feature image not found" || error.message === "No data provided for update") {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Controller for deleting a feature image
const deleteFeatureImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Call the service function to delete a feature image
    const result = await featureImageService.deleteFeatureImage(id);

    // Send success response
    res.status(200).json({
      success: true,
      message: "Feature image deleted successfully",
      data: result,
    });
  } catch (error) {
    // Handle errors
    if (error.message === "Feature image not found") {
      res.status(404).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = {
  createFeatureImage,
  getAllFeatureImages,
  getFeatureImageById,
  updateFeatureImage,
  deleteFeatureImage,
};