const cartService = require("../services/cartService");

const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user._id);
    res.status(200).json({ message: "Cart fetched successfully", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart", error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const cart = await cartService.addToCart(req.user._id, req.body);
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to add item", error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId, variant, quantity } = req.body;
    const cart = await cartService.updateCartItem(req.user._id, productId, variant, quantity);
    res.status(200).json({ message: "Item updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to update item", error: error.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { productId, variant } = req.body;
    const cart = await cartService.removeCartItem(req.user._id, productId, variant);
    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item", error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const result = await cartService.clearCart(req.user._id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
