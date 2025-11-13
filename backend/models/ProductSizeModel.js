const mongoose = require("mongoose");
const dataSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, unique: true },
    isActive: { type: Boolean, default: true, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ProductSizeModel = mongoose.model("ProductSize", dataSchema);

module.exports = ProductSizeModel;