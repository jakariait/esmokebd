const generalInfoService = require("../services/GeneralInfoService");

// Get General Info
const getGeneralInfo = async (req, res) => {
  try {
    const generalInfo = await generalInfoService.getGeneralInfo();
    if (!generalInfo) {
      return res.status(404).json({ message: "No General Info Found" });
    }
    return res.status(200).json(generalInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create or Update General Info
const generalInfoUpdate = async (req, res) => {
  try {
    const generalInfo = await generalInfoService.updateGeneralInfo(
      req.body,
      req.files,
    );
    res.status(200).json({
      success: true,
      message: "General Info Updated Successfully",
      data: generalInfo,
    });
  } catch (err) {
    console.error("Error in updateGeneralInfo Controller:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete General Info
const deleteGeneralInfo = async (req, res) => {
  try {
    const generalInfo = await generalInfoService.deleteGeneralInfo();
    res.status(200).json({
      message: "Successfully Deleted",
      data: generalInfo,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Export Controller functions
module.exports = {
  getGeneralInfo,
  generalInfoUpdate,
  deleteGeneralInfo,
};
