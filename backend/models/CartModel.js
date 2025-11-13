const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  contentId: String,
  name: String,
  originalPrice: Number,
  discountPrice: Number,
  variant: String,
  variantId: String,
  quantity: {
    type: Number,
    min: 1,
    default: 1,
  },
  thumbnail: String,
  slug: String,
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true, versionKey: false }
);

const CartModel = mongoose.model("Cart", cartSchema);
module.exports = CartModel;
