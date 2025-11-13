const productService = require("../services/productService");
const mongoose = require("mongoose");

// Create a product
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Check if thumbnailImage is uploaded
    if (req.files && req.files.thumbnailImage) {
      // Store only the image name (without the full path)
      productData.thumbnailImage = req.files.thumbnailImage[0].filename; // Save only the image name
    }

    // Check if images are uploaded
    if (req.files && req.files.images) {
      // Store only the image names (without the full paths)
      productData.images = req.files.images.map((file) => file.filename); // Save only the image names
    }

    const product = await productService.createProduct(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create product. Please try again!",
      error: error.message,
    });
  }
};

/**
 * Controller: Get all products
 */
const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts(); // Get all products without filters or pagination

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully!",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products. Please try again!",
      error: error.message,
    });
  }
};

/**
 * Controller: Get a single product by ID
 */
const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "✅ Product retrieved successfully!",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve product. Please try again!",
      error: error.message,
    });
  }
};
// Get a product by slug
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params; // Extract the slug from the URL

    // Call the service function to get the product by slug
    const product = await productService.getProductBySlug(slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "✅ Product retrieved successfully!",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve product. Please try again!",
      error: error.message,
    });
  }
};

/**
 * Controller: Delete a product by ID
 */
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found for deletion!",
      });
    }

    res.status(200).json({
      success: true,
      message: "✅ Product deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product. Please try again!",
      error: error.message,
    });
  }
};

// Get all products with filters, sorting, and pagination
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort,
      category,
      subcategory,
      childCategory,
      stock,
      flags,
      search,
    } = req.query;

    const productsData = await productService.getAllProducts({
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      category,
      subcategory,
      childCategory,
      stock,
      flags,
      isActive: true,
      search,
    });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      ...productsData, // Contains products, totalPages, totalProducts, currentPage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedData = req.body;
    const files = req.files; // Get uploaded files

    // Call the service with `files`
    const updatedProduct = await productService.updateProduct(
      productId,
      updatedData,
      files,
    );

    return res.status(200).json({
      success: true,
      message: "✅ Product updated successfully!",
      data: updatedProduct,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSimilarProductsController = async (req, res) => {
  const { category, productId } = req.params;

  try {
    // Quick check for valid ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(category) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid category or product ID.",
      });
    }

    const products = await productService.getSimilarProducts(
      category,
      productId,
    );

    res.status(200).json({
      success: true,
      message: "Similar products fetched successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch similar products",
      error: error.message,
    });
  }
};

// Get all products for the Admin Panel (no filter on isActive)
const getAllProductsAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort,
      category,
      subcategory,
      childCategory,
      stock,
      flags,
    } = req.query;

    // Call the service without the isActive filter (to get all products)
    const productsData = await productService.getAllProducts({
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      category,
      subcategory,
      childCategory,
      stock,
      flags,
      // Don't pass isActive filter here, meaning it will return all products
    });

    res.status(200).json({
      success: true,
      message: "All products fetched successfully for Admin Panel",
      ...productsData, // Contains products, totalPages, totalProducts, currentPage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products for Admin Panel",
      error: error.message,
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { productId, variantId } = req.body;
    const result = await productService.getProductDetailsService({
      productId,
      variantId,
    });

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("❌ Error in getProductDetails:", error.message);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "🚨 Server error!",
    });
  }
};


const homePageProducts = async (req, res) => {
  try {
    const data = await productService.getHomePageProducts();
    res.status(200).json({
      status: "success",
      message: "Home page products fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


module.exports = {
  createProduct,
  getProductBySlug,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSimilarProductsController,
  getAllProductsAdmin,
  getProductDetails,
  homePageProducts
};
