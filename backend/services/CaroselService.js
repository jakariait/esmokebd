const CarouselModel = require("../models/CarouselModel");

// Create Carousel

const createCarousel = async (imgSrc) => {
  return await CarouselModel.create({ imgSrc });
};

// Get All Carousel

const getAllCarousels = async () => {
  return await CarouselModel.find();
};

// Delete Carousel

const deleteCarousel = async (id) => {
  return await CarouselModel.findByIdAndDelete(id);
};

module.exports = {
  createCarousel,
  getAllCarousels,
  deleteCarousel,
};
