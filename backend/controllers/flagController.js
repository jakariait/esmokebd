const flagService = require("../services/flagService");

// Create a new flag
const createFlag = async (req, res) => {
  try {
    const flag = await flagService.createFlag(req.body);
    res.status(201).json({ success: true, message: "Flag created successfully", data: flag });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all flags
const getAllFlags = async (req, res) => {
  try {
    const flags = await flagService.getAllFlags();
    res.status(200).json({ success: true, data: flags });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single flag by ID
const getFlagById = async (req, res) => {
  try {
    const flag = await flagService.getFlagById(req.params.id);
    if (!flag) {
      return res.status(404).json({ success: false, message: "Flag not found" });
    }
    res.status(200).json({ success: true, data: flag });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a flag by ID
const updateFlag = async (req, res) => {
  try {
    const flag = await flagService.updateFlag(req.params.id, req.body);
    if (!flag) {
      return res.status(404).json({ success: false, message: "Flag not found" });
    }
    res.status(200).json({ success: true, message: "Flag updated successfully", data: flag });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a flag by ID
const deleteFlag = async (req, res) => {
  try {
    const flag = await flagService.deleteFlag(req.params.id);
    if (!flag) {
      return res.status(404).json({ success: false, message: "Flag not found" });
    }
    res.status(200).json({ success: true, message: "Flag deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateFlagPositions = async (req, res) => {
  try {
    await flagService.updateFlagPositions(req.body.flagIds);
    res.status(200).json({ success: true, message: "Flag positions updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createFlag,
  getAllFlags,
  getFlagById,
  updateFlag,
  deleteFlag,
  updateFlagPositions,
};