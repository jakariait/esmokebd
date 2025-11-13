const faqService = require("../services/FaqSevice");

// Create FAQ
const createFAQ = async (req, res) => {
  try {
    const faq = await faqService.createFAQ(req.body);
    res.status(201).json({
      message: "FAQ created successfully",
      data: faq,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create FAQ",
      error: err.message,
    });
  }
};

// Get All FAQs
const getAllFAQs = async (req, res) => {
  try {
    const faqs = await faqService.getAllFAQs();
    res.status(200).json({
      message: "FAQs fetched successfully",
      data: faqs,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch FAQs",
      error: err.message,
    });
  }
};

// Get Single FAQ
const getSingleFAQ = async (req, res) => {
  try {
    const faq = await faqService.getSingleFAQ(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    res.status(200).json({
      message: "FAQ fetched successfully",
      data: faq,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch FAQ",
      error: err.message,
    });
  }
};

// Update FAQ
const updateFAQ = async (req, res) => {
  try {
    const updated = await faqService.updateFAQ(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    res.status(200).json({
      message: "FAQ updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update FAQ",
      error: err.message,
    });
  }
};

// Delete FAQ
const deleteFAQ = async (req, res) => {
  try {
    const deleted = await faqService.deleteFAQ(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    res.status(200).json({
      message: "FAQ deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete FAQ",
      error: err.message,
    });
  }
};

module.exports = {
  createFAQ,
  getAllFAQs,
  getSingleFAQ,
  updateFAQ,
  deleteFAQ,
};
