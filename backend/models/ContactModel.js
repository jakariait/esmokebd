const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, required: true },
    phoneNumber: { type: String, trim: true, required: true },
    emailAddress: { type: String, trim: true },
    message: { type: String, trim: true, required: true },
    served: { type: Boolean, default: false }, // Default value set to false
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Contact = mongoose.model("Contact", dataSchema);

module.exports = Contact;
