const mongoose = require("mongoose");
const slugify = require("slugify");
const CounterModel = require("./CategoryCounterModel");

const subCategorySchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    isActive: { type: Boolean, default: true, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    categoryId: { type: Number, required: true },
    slug: { type: String, trim: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save middleware for categoryId auto-increment & slug generation
subCategorySchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await CounterModel.findOneAndUpdate(
        { name: "SubCategory" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );

      this.categoryId = counter.value;
      this.slug = slugify(`${this.name}-${this.categoryId}`, { lower: true });

      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Ensure model is not recompiled
const SubCategoryModel = mongoose.models.SubCategory || mongoose.model("SubCategory", subCategorySchema);
module.exports = SubCategoryModel;
