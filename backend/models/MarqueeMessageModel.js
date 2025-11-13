const mongoose = require("mongoose");

const marqueeMessageSchema = new mongoose.Schema(
  {
    messages: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one message is required",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Static method to check if there is already a document
marqueeMessageSchema.statics.checkIfExists = async function () {
  const count = await this.countDocuments();
  if (count > 1) {
    throw new Error("Only one marquee message set is allowed");
  }
};

const MarqueeMessage = mongoose.model("MarqueeMessage", marqueeMessageSchema);

module.exports = MarqueeMessage;
