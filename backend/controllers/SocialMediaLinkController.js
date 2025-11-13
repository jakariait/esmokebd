const SocialMediaLinkService = require("../services/SocialMediaLinkService");

// Get the social media link
const getSocialMedia = async (req, res) => {
  try {
    const socialMedia = await SocialMediaLinkService.getSocialMediaLink();
    if (!socialMedia) {
      return res.status(404).json({
        message: "No social media link found",
      });
    }
    res.status(200).json({
      message: "Social media link fetched successfully!",
      data: socialMedia,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the social media link
const updateSocialMedia = async (req, res) => {
  try {
    const updatedSocialMedia =
      await SocialMediaLinkService.updateSocialMediaLink(req.body);
    if (!updatedSocialMedia) {
      return res.status(404).json({
        message: "No social media link found to update",
      });
    }
    res.status(200).json({
      message: "Social media link updated successfully!",
      data: updatedSocialMedia,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSocialMedia, updateSocialMedia };
