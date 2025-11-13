const FAQ = require("../models/FaqModel");

const createFAQ = (faqData) => {
  return FAQ.create(faqData);
};

const getAllFAQs = () => {
  return FAQ.find().sort({ createdAt: -1 });
};

const getSingleFAQ = (id) => {
  return FAQ.findById(id);
};

const updateFAQ = (id, updateData) => {
  return FAQ.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteFAQ = (id) => {
  return FAQ.findByIdAndDelete(id);
};

module.exports = {
  createFAQ,
  getAllFAQs,
  getSingleFAQ,
  updateFAQ,
  deleteFAQ,
};