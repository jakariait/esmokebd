const mongoose = require("mongoose");

const vatPercentageSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

const VatPercentage = mongoose.model("VatPercentage", vatPercentageSchema);

module.exports = VatPercentage;
