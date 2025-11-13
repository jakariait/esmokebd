const ColorModel = require('../models/ColorModel');

// Get the first color entry (assuming only one entry will exist)
const getColors = async () => {
  const colors = await ColorModel.findOne().select('-updatedAt '); // Retrieve the first entry from the collection
  if (!colors) {
    throw new Error('No color entry found');
  }
  return colors;
};

// Update the color entry
const updateColor = async (colorData) => {
  const updatedColor = await ColorModel.findOneAndUpdate({}, colorData, { new: true });
  if (!updatedColor) {
    throw new Error('No color entry found to update');
  }
  return updatedColor;
};

module.exports = { getColors, updateColor };
