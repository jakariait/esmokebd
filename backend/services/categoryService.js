const CategoryModel = require("../models/CategoryModel");

const createCategory = async (categoryData) => {
	const category = new CategoryModel(categoryData);
	return await category.save();
};

const getCategories = async () => {
	return await CategoryModel.find();
};

const getCategoryById = async (id) => {
	return await CategoryModel.findById(id);
};

const updateCategory = async (id, categoryData) => {
	return await CategoryModel.findByIdAndUpdate(id, categoryData, { new: true });
};

const deleteCategory = async (id) => {
	return await CategoryModel.findByIdAndDelete(id);
};

module.exports = {
	createCategory,
	getCategories,
	getCategoryById,
	updateCategory,
	deleteCategory,
};
