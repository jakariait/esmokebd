const mongoose = require("mongoose");

const bkashConfigSchema = new mongoose.Schema({
  baseUrl: { type: String, default: "" },
  appKey: { type: String, default: "" },
  appSecret: { type: String, default: "" },
  username: { type: String, default: "" },
  password: { type: String, default: "" },
  isActive: { type: Boolean, default: false },  // new field
}, { timestamps: true });

const BkashConfig = mongoose.model("BkashConfig", bkashConfigSchema);

module.exports = BkashConfig;
