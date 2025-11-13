const abandonedCartService = require("../services/abandonedCartService");

const createAbandonedCart = async (req, res) => {
  try {
    const { number, cartItems, userId, fullName, email, address, totalAmount } =
      req.body;

    if (!number || !cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Validation failed: 'number' and 'cartItems' are required and cartItems cannot be empty.",
      });
    }

    const savedCart = await abandonedCartService.createAbandonedCart({
      number,
      cartItems,
      userId,
      fullName,
      email,
      address,
      totalAmount,
    });

    return res.status(201).json({
      success: true,
      message: "Abandoned cart created successfully.",
      data: savedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create abandoned cart.",
      error: error.message,
    });
  }
};


const getAllAbandonedCarts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const carts = await abandonedCartService.getAllAbandonedCarts(page, limit);

    return res.status(200).json({
      success: true,
      message: "Abandoned carts retrieved successfully.",
      data: carts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve abandoned carts.",
      error: error.message,
    });
  }
};


const deleteAbandonedCart = async (req, res) => {
  try {
    const deletedCart = await abandonedCartService.deleteAbandonedCartById(
      req.params.id,
    );
    if (!deletedCart) {
      return res.status(404).json({
        success: false,
        message: "Abandoned cart not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Abandoned cart deleted successfully.",
      data: deletedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete abandoned cart.",
      error: error.message,
    });
  }
};

module.exports = {
  createAbandonedCart,
  getAllAbandonedCarts,
  deleteAbandonedCart,
};
