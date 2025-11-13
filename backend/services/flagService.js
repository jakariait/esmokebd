const FlagModel = require("../models/FlagModel");

// Create a new flag
const createFlag = async (data) => {
  const count = await FlagModel.countDocuments();
  data.position = count;
  return await FlagModel.create(data);
};


// Get all flags
const getAllFlags = async () => {
  return await FlagModel.find().sort({ position: 1 });
};

// Get a flag by ID
const getFlagById = async (id) => {
  return await FlagModel.findById(id);
};

// Update a flag by ID
const updateFlag = async (id, data) => {
  return await FlagModel.findByIdAndUpdate(id, data, { new: true });
};

// Delete a flag by ID
const deleteFlag = async (id) => {
  const deletedFlag = await FlagModel.findByIdAndDelete(id);
  if (deletedFlag) {
    await FlagModel.updateMany(
      { position: { $gt: deletedFlag.position } },
      { $inc: { position: -1 } },
    );
  }
  return deletedFlag;
};

const updateFlagPositions = async (flagIds) => {
  const updates = flagIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { position: index } },
    },
  }));
  return await FlagModel.bulkWrite(updates);
};

module.exports = {
  createFlag,
  getAllFlags,
  getFlagById,
  updateFlag,
  deleteFlag,
  updateFlagPositions,
};