const couponService = require("../services/CouponService");

const createCoupon = async (req, res) => {
  try {
    const { message, data } = await couponService.createCoupon(req.body);
    res.status(201).json({ success: true, message, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const { message, data } = await couponService.applyCoupon(code, orderAmount);
    res.status(200).json({ success: true, message, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const { message, data } = await couponService.getAllCoupons();
    res.status(200).json({ success: true, message, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const { message, data } = await couponService.updateCoupon(req.params.id, req.body);
    if (!data) {
      return res.status(404).json({ success: false, message: "Coupon not found." });
    }
    res.status(200).json({ success: true, message, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { message, data } = await couponService.deleteCoupon(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Coupon not found." });
    }
    res.status(200).json({ success: true, message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  createCoupon,
  applyCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
};
