const mongoose = require("mongoose");

const freeDeliveryAmountSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

const FreeDeliveryAmount = mongoose.model("FreeDeliveryAmount", freeDeliveryAmountSchema);

module.exports = FreeDeliveryAmount;
