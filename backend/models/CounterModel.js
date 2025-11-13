const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 1000 },
});

const CounterModel = mongoose.model("Counter", counterSchema);
module.exports = CounterModel;
