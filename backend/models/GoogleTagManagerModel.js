const mongoose = require("mongoose");

const googleTagManagerSchema = new mongoose.Schema(
  {
    googleTagManagerId: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const GoogleTagManager = mongoose.model("GoogleTagManager", googleTagManagerSchema);

module.exports = GoogleTagManager;
