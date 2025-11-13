const SteadfastConfig = require("../models/SteadfastConfigModel");

exports.getSteadfastConfig = async () => {
  let config = await SteadfastConfig.findOne();

  // If no config found, return a default object (optional fallback)
  if (!config) {
    config = await SteadfastConfig.create({});
  }

  return config;
};

exports.updateSteadfastConfig = async (data) => {
  const existing = await SteadfastConfig.findOne();

  if (!existing) {
    // If config doesn't exist, create a new one with default values and merge
    return await SteadfastConfig.create(data);
  }

  return await SteadfastConfig.findByIdAndUpdate(existing._id, data, { new: true });
};
