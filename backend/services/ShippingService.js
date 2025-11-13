const Shipping = require("../models/ShippingModel");

const createShippingOption = async (data) => {
  try {
    const shippingOption = await Shipping.create(data);
    return shippingOption;
  } catch (error) {
    throw new Error("Error creating shipping option: " + error.message);
  }
};

const getAllShippingOptions = async () => {
  try {
    const shippingOptions = await Shipping.find();
    return shippingOptions;
  } catch (error) {
    throw new Error("Error retrieving shipping options: " + error.message);
  }
};

const getShippingById = async (id) => {
  try {
    const shippingOption = await Shipping.findById(id);
    if (!shippingOption) {
      throw new Error("Shipping option not found");
    }
    return shippingOption;
  } catch (error) {
    throw new Error("Error retrieving shipping option: " + error.message);
  }
};

const updateShippingOption = async (id, data) => {
  try {
    const updatedShippingOption = await Shipping.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedShippingOption) {
      throw new Error("Shipping option not found");
    }
    return updatedShippingOption;
  } catch (error) {
    throw new Error("Error updating shipping option: " + error.message);
  }
};

const deleteShippingOption = async (id) => {
  try {
    const deletedShippingOption = await Shipping.findByIdAndDelete(id);
    if (!deletedShippingOption) {
      throw new Error("Shipping option not found");
    }
    return deletedShippingOption;
  } catch (error) {
    throw new Error("Error deleting shipping option: " + error.message);
  }
};

module.exports = {
  createShippingOption,
  getAllShippingOptions,
  getShippingById,
  updateShippingOption,
  deleteShippingOption,
};