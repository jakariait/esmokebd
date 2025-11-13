const metaService = require('../services/metaService');

// Get meta information
const getMeta = async (req, res) => {
  try {
    const metaInfo = await metaService.getMetaInfo();
    if (!metaInfo) {
      return res.status(404).json({ message: 'Meta information not found.' });
    }
    res.status(200).json({
      message: 'Meta information fetched successfully.',
      data: metaInfo,
    });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching meta information.', error: error.message });
  }
};

// Update meta information
const updateMeta = async (req, res) => {
  try {
    const { title, keywords, description } = req.body;

    if (!title || !keywords || !description) {
      return res.status(400).json({ message: 'Title, keywords, and description are required.' });
    }

    const updatedMeta = await metaService.updateMetaInfo({ title, keywords, description });

    if (!updatedMeta) {
      return res.status(404).json({ message: 'Meta document not found to update.' });
    }

    res.status(200).json({
      message: 'Meta information updated successfully.',
      data: updatedMeta,
    });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating meta information.', error: error.message });
  }
};

module.exports = {
  getMeta,
  updateMeta,
};
