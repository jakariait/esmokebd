const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // ✅ Guest orders allowed
    },

    orderNo: {
      type: String,
      required: true,
      unique: true, // ✅ Use a custom-generated format like #YARN123456
    },

    transId: {
      type: String,
      required: false, // Optional if payment is manual
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "approved",
        "intransit",
        "delivered",
        "returned",
        "cancelled",
      ],
      default: "pending",
    },

    deliveryMethod: {
      type: String,
      enum: ["home_delivery"],
      required: true,
      default: "home_delivery",
    },

    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "bkash", "nagad", "card"],
      required: true,
      default: "cash_on_delivery",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },

    shippingInfo: {
      fullName: { type: String, required: true },
      mobileNo: { type: String, required: true },
      email: { type: String },
      address: { type: String, required: true },
    },
    paymentId:{
      type: String,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        variantId: { type: mongoose.Schema.Types.ObjectId },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        price: { type: Number, required: true },
      },
    ],

    rewardPointsUsed: {
      type: Number,
      default: 0,
      min: [0, "Reward points used cannot be negative"],
    },

    promoCode: {
      type: String,
    },

    promoDiscount: {
      type: Number,
      default: 0,
      min: [0, "Promo discount cannot be negative"],
    },

    vat: {
      type: Number,
      default: 0,
      min: [0, "VAT cannot be negative"],
    },

    deliveryCharge: {
      type: Number,
      required: true,
      min: [0, "Delivery charge must be greater than or equal to 0"],
    },

    shippingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipping",
      required: true,
    },

    specialDiscount: {
      type: Number,
      default: 0,
      min: [0, "Special discount cannot be negative"],
    },

    subtotalAmount: {
      type: Number,
      required: true, // before discount + delivery
      min: [0, "Subtotal amount must be greater than or equal to 0"],
    },

    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount must be greater than or equal to 0"],
    },

    advanceAmount: {
      type: Number,
      default: 0,
      min: [0, "Advance amount cannot be negative"],
    },
    dueAmount: {
      type: Number,
      min: [0, "Due amount must be greater than or equal to 0"],
    },

    rewardPointsEarned: {
      type: Number,
      default: 0,
      min: [0, "Reward points earned cannot be negative"],
    },

    adminNote: {
      type: String,
      default: "",
    },
    sentToCourier: {
      type: Boolean,
      default: false,
    }

  },
  { timestamps: true, versionKey: false },
);

// Custom validation logic
orderSchema.pre("save", function (next) {
  if (this.subtotalAmount < 0) {
    return next(new Error("Subtotal amount cannot be less than 0"));
  }

  this.totalAmount =
    this.subtotalAmount -
    this.promoDiscount -
    this.specialDiscount +
    this.deliveryCharge +
    this.vat;

  this.dueAmount = this.totalAmount - this.advanceAmount;

  next();
});

orderSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate();
    if (!update) return next();

    const order = await this.model.findOne(this.getQuery());
    if (!order) {
      return next(new Error('Order not found'));
    }

    const subtotalAmount = update.subtotalAmount !== undefined ? update.subtotalAmount : order.subtotalAmount;
    const promoDiscount = update.promoDiscount !== undefined ? update.promoDiscount : order.promoDiscount;
    const specialDiscount = update.specialDiscount !== undefined ? update.specialDiscount : order.specialDiscount;
    const deliveryCharge = update.deliveryCharge !== undefined ? update.deliveryCharge : order.deliveryCharge;
    const vat = update.vat !== undefined ? update.vat : order.vat;
    const advanceAmount = update.advanceAmount !== undefined ? update.advanceAmount : order.advanceAmount || 0;

    const totalAmount = (subtotalAmount - promoDiscount - specialDiscount) + deliveryCharge + vat;
    const dueAmount = totalAmount - advanceAmount;

    update.totalAmount = totalAmount;
    update.dueAmount = dueAmount;

    this.setUpdate(update);

    next();
  } catch (err) {
    next(err);
  }
});



module.exports = mongoose.model("Order", orderSchema);
