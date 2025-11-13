const mongoose = require("mongoose");
const CounterModel = require("./BlogCounterModel");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    blogId: { type: Number, unique: true, index: true }, // Auto-incremented
    thumbnailImage: { type: String, trim: true },
    name: { type: String, trim: true, required: true },
    author: { type: String, trim: true },
    slug: { type: String, trim: true, unique: true }, // Auto-generated
    longDesc: { type: String, trim: true },
    searchTags: [{ type: String, trim: true }],

    isActive: { type: Boolean, default: true, index: true },

    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    metaKeywords: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Auto-increment productId before validation
blogSchema.pre("validate", async function (next) {
  if (!this.blogId) {
    try {
      const counter = await CounterModel.findOneAndUpdate(
        { name: "blogId" },
        { $inc: { value: 1 } },
        { new: true, upsert: true },
      );
      this.blogId = counter.value;
    } catch (err) {
      return next(err);
    }
  }

  // Generate slug when name changes
  if (this.isModified("name") || this.isNew) {
    this.slug = `${slugify(this.name, { lower: true })}-${this.blogId}`;
  }

  next();
});

// Indexing for faster queries
blogSchema.index({ name: 1, slug: 1 });
blogSchema.index({ name: "text" });

const BlogModel = mongoose.model("Blog", blogSchema);

module.exports = BlogModel;