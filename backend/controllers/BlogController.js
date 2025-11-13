const blogService = require("../services/BlogService");

// Create a new blog
const createBlog = async (req, res) => {
  try {
    // ✅ Ensure the file is uploaded
    if (!req.files || !req.files.thumbnailImage) {
      return res.status(400).json({ message: "Thumbnail image is required" });
    }

    // ✅ Get filename only (not full path)
    const fileName = req.files.thumbnailImage[0].filename;

    // ✅ Add it to req.body
    req.body.thumbnailImage = fileName;

    // ✅ Save blog via service
    const blog = await blogService.createBlog(req.body);

    res.status(201).json({
      message: "✅ Blog created successfully",
      data: blog,
    });
  } catch (err) {
    res.status(500).json({
      message: "❌ Failed to create blog",
      error: err.message,
    });
  }
};

// Get all blogs with optional pagination
const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filters object
    const filters = {};
    if (req.query.isActive !== undefined) {
      filters.isActive = req.query.isActive === "true";
    }

    const [blogs, total] = await Promise.all([
      blogService.getPaginatedBlogs(filters, skip, limit),
      blogService.getTotalBlogCount(filters),
    ]);

    res.status(200).json({
      message: "✅ Blogs fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      count: blogs.length,
      data: blogs,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch blogs", error: err.message });
  }
};

// Get only active blogs with pagination
const getActiveBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      blogService.getActiveBlogs(skip, limit),
      blogService.getActiveBlogCount(),
    ]);

    res.status(200).json({
      message: "✅ Active blogs fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      count: blogs.length,
      data: blogs,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch active blogs", error: err.message });
  }
};

// Get blog by slug
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await blogService.getBlogBySlug(req.params.slug);
    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found with given slug" });
    }
    res.status(200).json({
      message: "✅ Blog fetched successfully by slug",
      data: blog,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch blog by slug", error: err.message });
  }
};

// Get blog by ID
const getBlogById = async (req, res) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found with given ID" });
    }
    res.status(200).json({
      message: "✅ Blog fetched successfully by ID",
      data: blog,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch blog by ID", error: err.message });
  }
};

// Update blog by ID
const updateBlog = async (req, res) => {
  try {
    // If new thumbnail image is uploaded, it will be in req.files.thumbnailImage (array)
    if (
      req.files &&
      req.files.thumbnailImage &&
      req.files.thumbnailImage.length > 0
    ) {
      req.body.thumbnailImage = req.files.thumbnailImage[0].filename;
    }

    const blog = await blogService.updateBlog(req.params.id, req.body);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found to update" });
    }
    res.status(200).json({
      message: "✅ Blog updated successfully",
      data: blog,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update blog", error: err.message });
  }
};

// Delete blog by ID
const deleteBlog = async (req, res) => {
  try {
    const blog = await blogService.deleteBlog(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found to delete" });
    }
    res.status(200).json({
      message: "✅ Blog deleted successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete blog", error: err.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getActiveBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog,
};