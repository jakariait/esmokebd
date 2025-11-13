const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    instagram: { type: String,trim: true },
    linkedin: { type: String,trim: true },
    messenger: { type: String,trim: true },
    whatsapp: { type: String,trim: true },
    telegram: { type: String,trim: true },
    youtube: { type: String,trim: true },
    tiktok: { type: String, trim: true },
    pinterest: { type: String,trim: true },
    viber: { type: String,trim: true },

  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const SocialMediaLink = mongoose.model("SocialMediaLink", dataSchema);

module.exports = SocialMediaLink;
