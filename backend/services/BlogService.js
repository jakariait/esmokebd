const BlogModel = require("../models/BlogModel");

// Create a new blog
const createBlog = (data) => {
  const blog = new BlogModel(data);
  return blog.save();
};

// Get all blogs with optional filters (no pagination)
const getAllBlogs = (filters = {}) => {
  return BlogModel.find(filters).select("-longDesc").sort({ createdAt: -1 });
};

// Get paginated blogs with filters
const getPaginatedBlogs = (filters = {}, skip = 0, limit = 10) => {
  return BlogModel.find(filters)
    .select("-longDesc")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Get total blog count with filters
const getTotalBlogCount = (filters = {}) => {
  return BlogModel.countDocuments(filters);
};

// Get only active blogs with pagination
const getActiveBlogs = (skip = 0, limit = 10) => {
  return BlogModel.find({ isActive: true })
    .select("-longDesc")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Get count of active blogs
const getActiveBlogCount = () => {
  return BlogModel.countDocuments({ isActive: true });
};

// Get blog by slug (only active)
const getBlogBySlug = (slug) => {
  return BlogModel.findOne({ slug, isActive: true });
};

// Get blog by ID
const getBlogById = (id) => {
  return BlogModel.findById(id);
};

// Update blog by ID
const updateBlog = (id, updates) => {
  return BlogModel.findByIdAndUpdate(id, updates, { new: true });
};

// Delete blog by ID
const deleteBlog = (id) => {
  return BlogModel.findByIdAndDelete(id);
};

module.exports = {
  createBlog,
  getAllBlogs,
  getPaginatedBlogs,
  getTotalBlogCount,
  getActiveBlogs,
  getActiveBlogCount,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog,
};