const colorService = require('../services/ColorService');

// Get the colors
const getColors = async (req, res) => {
  try {
    const colors = await colorService.getColors();
    res.status(200).json({
      message: 'Colors fetched successfully!',
      data: colors,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update the colors
const updateColor = async (req, res) => {
  try {
    const updatedColor = await colorService.updateColor(req.body);
    res.status(200).json({
      message: 'Colors updated successfully!',
      data: updatedColor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getColors, updateColor };
