const MarqueeMessage = require("../models/MarqueeMessageModel");

const getActiveMessages = async () => {
  // Get the first document from the collection
  return MarqueeMessage.findOne(); // No isActive filtering
};

const updateMessageSet = async (id, updateData) => {
  return MarqueeMessage.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

module.exports = {
  getActiveMessages,
  updateMessageSet,
};
