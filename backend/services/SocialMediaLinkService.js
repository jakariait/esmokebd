const SocialMediaLinkModel = require('../models/SocialMediaLinkModel');

// Get the first social media link entry (assuming only one entry will exist)
const getSocialMediaLink = async () => {
  const getSocialMedia = await SocialMediaLinkModel.findOne().select('-updatedAt'); // Retrieve the first entry from the collection
  if (!getSocialMedia) {
    throw new Error('No social media link found');
  }
  return getSocialMedia;
};

// Update the social media link entry
const updateSocialMediaLink = async (socialMedia) => {
  const updatedSocialMedia = await SocialMediaLinkModel.findOneAndUpdate({}, socialMedia, { new: true }).select('-updatedAt');
  if (!updatedSocialMedia) {
    throw new Error('No social media link found to update');
  }
  return updatedSocialMedia;
};

module.exports = { getSocialMediaLink, updateSocialMediaLink };
