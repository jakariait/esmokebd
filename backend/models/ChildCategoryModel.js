const mongoose = require("mongoose");
const CounterModel = require("./ChildCategoryCounter"); // Assuming it's the same for auto-increment
const slugify = require("slugify");

const childCategorySchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    isActive: { type: Boolean, default: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Reference to the Category model
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory", // Reference to the SubCategory model
      required: true,
    },
    categoryId: { type: Number}, // Auto-increment field
    slug: { type: String, trim: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save hook for categoryId auto-increment and slug generation
childCategorySchema.pre("save", async function (next) {
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

const ChildCategory = mongoose.models.ChildCategory || mongoose.model("ChildCategory", childCategorySchema);

module.exports = ChildCategory;
