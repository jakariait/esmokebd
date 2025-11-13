const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Shipping name is required"],
      trim: true,
    },
    value: {
      type: Number,
      required: [true, "Shipping value is required"],
      min: [0, "Shipping value cannot be negative"],
    },
  },
  { timestamps: true, versionKey: false },
);

const Shipping = mongoose.model("Shipping", shippingSchema);

module.exports = Shipping;
