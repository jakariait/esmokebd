const {
  getGoogleTagManager,
  updateGoogleTagManager,
} = require("../services/GoogleTagManagerService");

const getGTM = async (req, res) => {
  try {
    const data = await getGoogleTagManager();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to get GTM settings", error: err.message });
  }
};

const updateGTM = async (req, res) => {
  try {
    const data = await updateGoogleTagManager(req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to update GTM settings", error: err.message });
  }
};

module.exports = {
  getGTM,
  updateGTM,
};
