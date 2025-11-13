const mongoose = require("mongoose");

const abandonedCartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    fullName: { type: String },
    number: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    cartItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        variantId: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("AbandonedCart", abandonedCartSchema);
