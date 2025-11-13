const mongoose = require("mongoose");

const DataSchema = mongoose.Schema(
  {
    imgSrc: { type: String, required: true },
    title: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const FeatureImageModel = mongoose.model("FeatureImage", DataSchema);

module.exports = FeatureImageModel;
