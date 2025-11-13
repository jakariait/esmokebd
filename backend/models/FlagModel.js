const mongoose = require("mongoose");

const DataSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      collation: {
        locale: "en",
        strength: 2, // Case-insensitive comparison
      },
    },
    position: {
      type: Number,
      required: true,
    },
    isActive: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const FlagModel = mongoose.model("Flag", DataSchema);

module.exports = FlagModel;