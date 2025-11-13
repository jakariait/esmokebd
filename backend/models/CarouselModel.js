const mongoose = require("mongoose");

const DataSchema = mongoose.Schema(
  {
    imgSrc: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const CarouselModel = mongoose.model("Carousel", DataSchema);

module.exports = CarouselModel;
