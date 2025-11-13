const VatPercentage = require("../models/VatPercentage");

const getAmount = async () => {
  try {
    let doc = await VatPercentage.findOne();
    if (!doc) {
      doc = await VatPercentage.create({ value: 0 });
    }
    return doc;
  } catch (error) {
    throw new Error("Failed to fetch VAT Percentage.");
  }
};

const updateAmount = async (newValue) => {
  try {
    let doc = await VatPercentage.findOne();
    if (!doc) {
      doc = await VatPercentage.create({ value: newValue });
    } else {
      doc.value = newValue;
      await doc.save();
    }
    return doc;
  } catch (error) {
    throw new Error("Failed to update VAT Percentage.");
  }
};

module.exports = {
  getAmount,
  updateAmount,
};