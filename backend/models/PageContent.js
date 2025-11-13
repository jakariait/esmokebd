const mongoose = require("mongoose");

const pageContentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      enum: [
        "about",
        "terms",
        "privacy",
        "refund",
        "shipping"
      ],
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const PageContent = mongoose.model("PageContent", pageContentSchema);
module.exports = PageContent;
