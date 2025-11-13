const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema(
  {
    primaryColor: { type: String, required: true, default: "#000000" },
    secondaryColor: { type: String, required: true, default: "#00395d" },
    tertiaryColor: { type: String, required: true, default: "#b6d7a8" },
    accentColor: { type: String, required: true, default: "#eeeeee" },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Color = mongoose.model("Color", colorSchema);

module.exports = Color;
