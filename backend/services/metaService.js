const Meta = require('../models/MetaModel');

const getMetaInfo = async () => {
  try {
    return await Meta.findOne();
  } catch (error) {
    throw new Error('Failed to fetch meta information');
  }
};

const updateMetaInfo = async ({ title, keywords, description }) => {
  try {
    return await Meta.findOneAndUpdate(
      {},
      { $set: { title, keywords, description } },
      { new: true }
    );
  } catch (error) {
    throw new Error('Failed to update meta information');
  }
};

module.exports = {
  getMetaInfo,
  updateMetaInfo,
};
