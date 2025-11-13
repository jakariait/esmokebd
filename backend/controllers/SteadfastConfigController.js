const steadfastService = require("../services/SteadfastConfigService");

exports.getConfig = async (req, res) => {
  try {
    const config = await steadfastService.getSteadfastConfig();
    res.status(200).json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const config = await steadfastService.updateSteadfastConfig(req.body);
    res.status(200).json({ success: true, data: config });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
