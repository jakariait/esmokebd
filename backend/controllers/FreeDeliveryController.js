const freeDeliveryService = require("../services/FreeDeliveryService");

const getFreeDeliveryAmount = async (req, res) => {
  try {
    const result = await freeDeliveryService.getAmount();
    res.status(200).json({
      success: true,
      message: "Free delivery amount fetched successfully.",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while fetching free delivery amount.",
    });
  }
};

const updateFreeDeliveryAmount = async (req, res) => {
  try {
    const { value } = req.body;
    if (typeof value !== "number" || value < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid value. It must be a non-negative number.",
      });
    }

    const result = await freeDeliveryService.updateAmount(value);
    res.status(200).json({
      success: true,
      message: "Free delivery amount updated successfully.",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while updating free delivery amount.",
    });
  }
};

module.exports = {
  getFreeDeliveryAmount,
  updateFreeDeliveryAmount,
};
