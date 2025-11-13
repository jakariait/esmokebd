const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
	{
		name: { type: String, trim: true, required: true, unique: true },
		featureCategory: { type: Boolean, default: true, required: true },
		showOnNavbar: { type: Boolean, default: true, required: true },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const CategoryModel = mongoose.model("Category", dataSchema);

module.exports = CategoryModel;
