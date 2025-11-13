const VatPercentageService = require("../services/VatPercentageService");

const getVatPercentage = async (req, res) => {
  try {
    const result = await VatPercentageService.getAmount();
    res.status(200).json({
      success: true,
      message: "VAT percentage fetched successfully.",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while fetching VAT percentage.",
    });
  }
};

const updateVatPercentage = async (req, res) => {
  try {
    const { value } = req.body;
    if (typeof value !== "number" || value < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid value. It must be a non-negative number.",
      });
    }

    const result = await VatPercentageService.updateAmount(value);
    res.status(200).json({
      success: true,
      message: "VAT percentage updated successfully.",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while updating VAT percentage.",
    });
  }
};

module.exports = {
  getVatPercentage,
  updateVatPercentage,
};

