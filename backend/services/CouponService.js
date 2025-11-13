const Coupon = require("../models/CouponModel");

const createCoupon = async (data) => {
  const coupon = new Coupon(data);
  const saved = await coupon.save();
  return { message: "Coupon created successfully.", data: saved };
};

const applyCoupon = async (code, orderAmount) => {
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    status: "active",
  });

  if (!coupon) throw new Error("Invalid or expired coupon code.");

  const now = new Date();
  if (now < coupon.startDate || now > coupon.endDate) {
    throw new Error("This coupon is not currently valid.");
  }

  if (orderAmount < coupon.minimumOrder) {
    throw new Error(
      `Minimum order amount of Tk. ${coupon.minimumOrder} is required.`,
    );
  }

  return {
    message: "Coupon applied successfully.",
    data: coupon,
  };
};

const getAllCoupons = async () => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  return {
    message:
      coupons.length > 0
        ? "Coupons retrieved successfully."
        : "No coupons found.",
    data: coupons,
  };
};

const updateCoupon = async (id, data) => {
  const updated = await Coupon.findByIdAndUpdate(id, data, { new: true });
  return {
    message: updated ? "Coupon updated successfully." : null,
    data: updated,
  };
};

const deleteCoupon = async (id) => {
  const deleted = await Coupon.findByIdAndDelete(id);
  return {
    message: deleted ? "Coupon deleted successfully." : null,
    data: deleted,
  };
};

module.exports = {
  createCoupon,
  applyCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
};
