const mongoose = require("mongoose");

const DataSchema = mongoose.Schema(
  {
    Email: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const NewslettersModel = mongoose.model("NewslettersModel", DataSchema);

module.exports = NewslettersModel;
