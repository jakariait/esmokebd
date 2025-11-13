const mongoose = require('mongoose');

const orderCounterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g., 'order'
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model('OrderCounter', orderCounterSchema);
