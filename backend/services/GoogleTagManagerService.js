const GoogleTagManager = require("../models/GoogleTagManagerModel");

const getGoogleTagManager = async () => {
  let data = await GoogleTagManager.findOne();
  if (!data) {
    data = await GoogleTagManager.create({}); // default
  }
  return data;
};

const updateGoogleTagManager = async (payload) => {
  const { googleTagManagerId, isActive } = payload;

  let data = await GoogleTagManager.findOne();
  if (!data) {
    data = await GoogleTagManager.create({ googleTagManagerId, isActive });
  } else {
    data.googleTagManagerId = googleTagManagerId ?? data.googleTagManagerId;
    data.isActive = typeof isActive === "boolean" ? isActive : data.isActive;
    await data.save();
  }

  return data;
};

module.exports = {
  getGoogleTagManager,
  updateGoogleTagManager,
};
