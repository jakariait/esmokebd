const bkashService = require("../services/bkashConfigService");
const BkashConfig = require("../models/BkashConfigModel");


async function getBkashConfig(req, res) {
  try {
    const config = await bkashService.getBkashConfig();
    if (!config) return res.status(404).json({ message: "bKash config not found" });

    res.json({ data: config });
  } catch (err) {
    console.error("Failed to get bKash config:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateBkashConfig(req, res) {
  try {
    const updatedConfig = await bkashService.updateBkashConfig(req.body);
    res.json({ message: "bKash config updated successfully", data: updatedConfig });
  } catch (err) {
    console.error("Failed to update bKash config:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getBkashIsActive(req, res) {
  try {
    const config = await BkashConfig.findOne().lean();
    if (!config) {
      return res.status(404).json({ success: false, message: "bKash config not found" });
    }
    return res.json({ success: true, isActive: config.isActive });
  } catch (error) {
    console.error("Error fetching bKash isActive:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = {
  getBkashConfig,
  updateBkashConfig,
  getBkashIsActive
};
