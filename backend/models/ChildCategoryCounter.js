const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 },
});

const ChildCategoryCounterModel = mongoose.model("ChildCategoryCounter", counterSchema);

module.exports = ChildCategoryCounterModel;
