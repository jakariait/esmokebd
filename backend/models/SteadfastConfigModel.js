const mongoose = require("mongoose");

const steadfastConfigSchema = new mongoose.Schema({
  baseUrl: {
    type: String,
    default: "",
  },
  apiKey: {
    type: String,
    default: "",
  },
  secretKey: {
    type: String,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("SteadfastConfig", steadfastConfigSchema);
