const shippingService = require("../services/ShippingService");

const createShipping = async (req, res) => {
  try {
    const shipping = await shippingService.createShippingOption(req.body);
    res.status(201).json({
      success: true,
      message: "Shipping option created successfully",
      data: shipping,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while creating shipping option",
    });
  }
};

const getAllShipping = async (req, res) => {
  try {
    const shippings = await shippingService.getAllShippingOptions();

    if (!shippings || shippings.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No shipping options available",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Shipping options retrieved successfully",
      data: shippings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error retrieving shipping options",
    });
  }
};

const getShippingById = async (req, res) => {
  try {
    const shipping = await shippingService.getShippingById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Shipping option retrieved successfully",
      data: shipping,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || "Shipping option not found",
    });
  }
};

const updateShipping = async (req, res) => {
  try {
    const shipping = await shippingService.updateShippingOption(
      req.params.id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Shipping option updated successfully",
      data: shipping,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating shipping option",
    });
  }
};

const deleteShipping = async (req, res) => {
  try {
    const shipping = await shippingService.deleteShippingOption(req.params.id);
    res.status(200).json({
      success: true,
      message: "Shipping option deleted successfully",
      data: shipping,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting shipping option",
    });
  }
};

module.exports = {
  createShipping,
  getAllShipping,
  getShippingById,
  updateShipping,
  deleteShipping,
};
