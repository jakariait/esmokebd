const mongoose = require("mongoose");
const CounterModel = require("./CounterModel");
const slugify = require("slugify");

const productSizeSchema = new mongoose.Schema({
  size: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductSize",
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    validate: {
      validator: function (value) {
        return value >= 0; // Ensure the value is greater than or equal to 0
      },
      message: "Stock cannot be negative",
    },
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (value) {
        return value >= 0; // Ensure the value is greater than or equal to 0
      },
      message: "Price cannot be negative",
    },
  },
  discount: {
    type: Number,
    min: 0,
    validate: {
      validator: function (value) {
        return value >= 0; // Ensure the value is greater than or equal to 0
      },
      message: "Discount cannot be negative",
    },
  },
});

const productSchema = new mongoose.Schema(
  {
    productId: { type: Number, unique: true, index: true }, // Auto-incremented
    name: { type: String, trim: true, required: true },
    slug: { type: String, trim: true, unique: true }, // Auto-generated
    shortDesc: { type: String, trim: true },
    longDesc: { type: String, trim: true },
    sizeChart: { type: String, trim: true },
    shippingReturn: { type: String, trim: true },
    productCode: { type: String, trim: true },

    rewardPoints: {
      type: Number,
      validate: {
        validator: function (value) {
          return value >= 0; // Ensure the value is greater than or equal to 0
        },
        message: "Reward points cannot be negative",
      },
    },
    videoUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true, index: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    childCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChildCategory",
    },

    flags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flag" }],

    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    metaKeywords: [{ type: String, trim: true }],
    searchTags: [{ type: String, trim: true }],

    thumbnailImage: { type: String, trim: true, required: true },
    images: [{ type: String, trim: true, required: true }],

    variants: { type: [productSizeSchema], default: [] },

    finalPrice: {
      type: Number,
      min: 0,
      required: function () {
        return this.variants.length === 0; // Make finalPrice required if no variants exist
      },
      validate: {
        validator: function (value) {
          return value >= 0; // Ensure the value is greater than or equal to 0
        },
        message: "Price cannot be negative",
      },
    },

    finalDiscount: {
      type: Number,

      min: 0,
      validate: {
        validator: function (value) {
          return value >= 0; // Ensure the value is greater than or equal to 0
        },
        message: "Discount cannot be negative",
      },
    },
    finalStock: {
      type: Number,
      min: 0,
      required: function () {
        return this.variants.length === 0; // Make finalPrice required if no variants exist
      },
      validate: {
        validator: function (value) {
          return value >= 0; // Ensure the value is greater than or equal to 0
        },
        message: "Stock cannot be negative",
      },
    },
    purchasePrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          return value >= 0; // Ensure the value is greater than or equal to 0
        },
        message: "Purchase cannot be negative",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Auto-increment productId before validation
productSchema.pre("validate", async function (next) {
  if (!this.productId) {
    try {
      const counter = await CounterModel.findOneAndUpdate(
        { name: "productId" },
        { $inc: { value: 1 } },
        { new: true, upsert: true },
      );
      this.productId = counter.value;
    } catch (err) {
      return next(err);
    }
  }

  // Generate slug when name changes
  if (this.isModified("name") || this.isNew) {
    this.slug = `${slugify(this.name, { lower: true })}-${this.productId}`;
  }

  next();
});

// Pre-save hook to calculate finalPrice, finalDiscount, and finalStock
productSchema.pre("save", function (next) {
  if (this.variants.length > 0) {
    // If variants exist, set finalPrice, finalDiscount, and finalStock based on variants
    this.finalPrice =
      this.variants.reduce((sum, v) => sum + v.price, 0) / this.variants.length;
      this.finalDiscount =
      this.variants.reduce((sum, v) => sum + v.discount, 0) /
      this.variants.length;
    this.finalStock = this.variants.reduce((total, v) => total + v.stock, 0);
  } else {
    // If no variants, set finalPrice, finalDiscount, and finalStock to direct product input values
    this.finalPrice = this.finalPrice || 0; // Or set it to the product-level price if needed
    this.finalDiscount = this.finalDiscount || 0; // Or set it to the product-level discount if needed
    this.finalStock = this.finalStock || 0; // Or set it to the product-level stock if needed
  }

  next();
});

// Indexing for faster queries
productSchema.index({ name: 1, slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: "text" });


const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
