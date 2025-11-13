const mongoose = require("mongoose");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const OrderCounter = require("../models/OrderCounterModel");
const VatPercentage = require("../models/VatPercentage"); // adjust path as needed
const Shipping = require("../models/ShippingModel");
const FreeDeliveryAmount = require("../models/FreeDeliveryAmount");
const User = require("../models/UserModel");
const Coupon = require("../models/CouponModel");
const ProductSizeModel = require("../models/ProductSizeModel"); // Import the ProductSizeModel

const createOrder = async (orderData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get user (optional for guests)
    let user = null;
    if (userId) {
      user = await User.findById(userId);
      if (!user) throw new Error("User not found");
    }

    // Generate order number
    const counter = await OrderCounter.findOneAndUpdate(
      { id: "order" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, session },
    );
    const orderNo = String(counter.seq).padStart(6, "0");

    // Get VAT
    const vatEntry = await VatPercentage.findOne().sort({ createdAt: -1 });
    const vatPercent = vatEntry ? vatEntry.value : 0;

    // Calculate subtotal and update stock
    let subtotal = 0;
    const updatedItems = [];

    for (const item of orderData.items) {
      const { productId, variantId, quantity } = item;

      const product = await Product.findById(productId);
      if (!product) throw new Error("Product not found");

      let price, stock;

      if (product.variants.length === 0) {
        price =
          product.finalDiscount > 0
            ? product.finalDiscount
            : product.finalPrice;
        stock = product.finalStock;

        if (stock < quantity)
          throw new Error(`Not enough stock for product ${productId}`);

        await Product.updateOne(
          { _id: productId },
          { $inc: { finalStock: -quantity } },
          { session },
        );
      } else {
        const variant = product.variants.find(
          (v) => v._id.toString() === variantId,
        );
        if (!variant) throw new Error("Variant not found");

        if (variant.stock < quantity)
          throw new Error(`Not enough stock for variant ${variantId}`);

        price = variant.discount || variant.price;

        await Product.updateOne(
          { _id: productId, "variants._id": variantId },
          { $inc: { "variants.$.stock": -quantity } },
          { session },
        );
      }

      subtotal += price * quantity;
      updatedItems.push({ productId, variantId, quantity, price }); // Store price for each item
    }

    // Handle shipping
    const shippingMethod = await Shipping.findById(orderData.shippingId);
    if (!shippingMethod) throw new Error("Invalid shipping method");

    const freeDelivery = await FreeDeliveryAmount.findOne().sort({
      createdAt: -1,
    });
    const freeDeliveryThreshold = freeDelivery ? freeDelivery.value : 0;

    const deliveryCharge =
      freeDeliveryThreshold > 0 && subtotal >= freeDeliveryThreshold
        ? 0
        : shippingMethod.value;

    // ✅ Backend Coupon Validation
    let promoDiscount = 0;
    let appliedCouponCode = orderData.promoCode || null;

    if (appliedCouponCode) {
      const coupon = await Coupon.findOne({
        code: appliedCouponCode.toUpperCase(),
        status: "active",
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      });

      if (!coupon) throw new Error("Invalid or expired promo code");

      if (subtotal < coupon.minimumOrder)
        throw new Error(
          `Minimum order amount for this coupon is ৳${coupon.minimumOrder}`,
        );

      if (coupon.type === "percentage") {
        promoDiscount = Math.floor((coupon.value / 100) * subtotal);
      } else if (coupon.type === "amount") {
        promoDiscount = coupon.value;
      }

      // Cap promo discount if it exceeds subtotal
      promoDiscount = Math.min(promoDiscount, subtotal);
    }

    // Reward points
    const rewardPointsUsed = orderData.rewardPointsUsed || 0;
    const finalSubtotal = subtotal - promoDiscount - rewardPointsUsed;

    const vat = (finalSubtotal * vatPercent) / 100;
    const totalAmount = finalSubtotal + vat + deliveryCharge;

    // Save order
    const newOrder = new Order({
      ...orderData,
      orderNo,
      userId,
      items: updatedItems,
      subtotalAmount: subtotal,
      deliveryCharge,
      vat,
      totalAmount,
      promoCode: appliedCouponCode,
      promoDiscount,
      rewardPointsUsed,
      specialDiscount: 0,
      rewardPointsEarned: 0,
      adminNote: "",
    });

    const savedOrder = await newOrder.save({ session });

    await session.commitTransaction();
    session.endSession();

    return savedOrder;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message);
  }
};

const getAllOrders = async (filter = {}, page, limit, search = '') => {
  try {
    let queryFilter = { ...filter };

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      queryFilter.$or = [
        { orderNo: searchRegex },
        { 'shippingInfo.fullName': searchRegex },
        { 'shippingInfo.mobileNo': searchRegex },
        { 'shippingInfo.email': searchRegex },
        { 'shippingInfo.address': searchRegex },
      ];
    }

    let query = Order.find(queryFilter)
      .populate("userId")
      .populate({
        path: "items.productId",
        select:
          "-sizeChart -longDesc -shortDesc -shippingReturn -videoUrl -flags -metaTitle -metaDescription -metaKeywords -searchTags",
      })
      .populate("items.variantId")
      .sort({ createdAt: -1 });

    // Only apply pagination if page and limit are valid
    let totalOrders = await Order.countDocuments(queryFilter);
    let orders;
    let totalPages = null;
    let currentPage = null;

    if (page && limit) {
      const validatedPage = Math.max(1, parseInt(page));
      const validatedLimit = Math.max(1, parseInt(limit));
      const skip = (validatedPage - 1) * validatedLimit;

      orders = await query.skip(skip).limit(validatedLimit);
      totalPages = Math.ceil(totalOrders / validatedLimit);
      currentPage = validatedPage;
    } else {
      orders = await query;
    }

    return {
      totalOrders,
      orders,
      totalPages,
      currentPage,
    };
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    throw new Error("Error fetching orders: " + error.message);
  }
};

// Get order by ID
const getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
      .populate("userId")
      .populate({
        path: "items.productId",
        select:
          "-sizeChart -longDesc -shortDesc -shippingReturn -videoUrl -flags -metaTitle -metaDescription -metaKeywords -searchTags",
        populate: {
          path: "category",
          select: "name", // Only bring category name
        },
      })
      .populate({
        path: "items.variantId",
      })
      .sort({ createdAt: -1 })
      .lean();

    if (!order) {
      throw new Error("Order not found");
    }

    // Collect all unique size IDs for the selected variants
    const sizeIds = new Set();
    order.items.forEach((item) => {
      if (item.productId && item.productId.variants.length > 0) {
        const matchedVariant = item.productId.variants.find(
          (variant) => variant._id.toString() === item.variantId.toString(),
        );
        if (matchedVariant && matchedVariant.size) {
          sizeIds.add(matchedVariant.size); // Add the size ID of the matched variant
        }
      }
    });

    // Fetch all size names in one query
    const sizes = await ProductSizeModel.find({
      _id: { $in: Array.from(sizeIds) },
    })
      .select("name")
      .lean();
    const sizeMap = new Map(
      sizes.map((size) => [size._id.toString(), size.name]),
    );

    // Iterate through items and remove non-matched variants, set size name for the matched variant only
    order.items = order.items.map((item) => {
      if (item.productId && item.productId.variants) {
        // Filter variants to keep only the matched variant
        item.productId.variants = item.productId.variants.filter(
          (variant) => variant._id.toString() === item.variantId.toString(),
        );

        // If a matched variant is found, set its size name
        if (item.productId.variants.length > 0) {
          const variant = item.productId.variants[0]; // The matched variant
          const sizeId = variant.size;
          variant.sizeName = sizeMap.get(sizeId.toString()) || "N/A"; // Set size name for the matched variant
        }
      }
      return item;
    });

    return order;
  } catch (error) {
    throw new Error("Error fetching order by ID: " + error.message);
  }
};

const updateOrder = async (orderId, updateData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the existing order to compare the status
    const existingOrder = await Order.findById(orderId).session(session);
    if (!existingOrder) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("Order not found");
    }

    // Update the order data
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      session,
    });
    if (!updatedOrder) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("Order not found after update"); // Added extra check
    }

    // Check if the status has changed to 'Returned' or 'Cancelled'
    const isNowReturnedOrCancelled =
      updatedOrder.orderStatus === "returned" ||
      updatedOrder.orderStatus === "cancelled";
    const wasNotReturnedOrCancelled =
      existingOrder.orderStatus !== "returned" &&
      existingOrder.orderStatus !== "cancelled";

    if (isNowReturnedOrCancelled && wasNotReturnedOrCancelled) {
      // Restore stock for each item in the order
      for (const item of updatedOrder.items) {
        const { productId, variantId, quantity } = item;

        const product = await Product.findById(productId).session(session);
        if (!product) throw new Error(`Product not found for ID ${productId}`);

        if (!product.variants || product.variants.length === 0) {
          await Product.updateOne(
            { _id: productId },
            { $inc: { finalStock: quantity } },
            { session },
          );
        } else {
          const variant = product.variants.find(
            (v) => v._id.toString() === variantId.toString(),
          );
          if (!variant)
            throw new Error(`Variant not found for ID ${variantId}`);

          await Product.updateOne(
            { _id: productId, "variants._id": variantId },
            { $inc: { "variants.$.stock": quantity } },
            { session },
          );
        }
      }
    }

    // Check if the status is changing from 'returned' or 'cancelled' to any of the following statuses
    const isRevertingToActiveStatus =
      (existingOrder.orderStatus === "returned" ||
        existingOrder.orderStatus === "cancelled") &&
      ["pending", "approved", "intransit", "delivered"].includes(
        updatedOrder.orderStatus,
      );

    if (isRevertingToActiveStatus) {
      // Deduct stock for each item in the order
      for (const item of updatedOrder.items) {
        const { productId, variantId, quantity } = item;

        const product = await Product.findById(productId).session(session);
        if (!product) throw new Error(`Product not found for ID ${productId}`);

        if (!product.variants || product.variants.length === 0) {
          await Product.updateOne(
            { _id: productId },
            { $inc: { finalStock: -quantity } }, // Deduct stock
            { session },
          );
        } else {
          const variant = product.variants.find(
            (v) => v._id.toString() === variantId.toString(),
          );
          if (!variant)
            throw new Error(`Variant not found for ID ${variantId}`);

          await Product.updateOne(
            { _id: productId, "variants._id": variantId },
            { $inc: { "variants.$.stock": -quantity } }, // Deduct stock
            { session },
          );
        }
      }
    }

    // If order is now marked as 'delivered', set paymentStatus to 'paid'
    if (updatedOrder.orderStatus === "delivered") {
      updatedOrder.paymentStatus = "paid";
      await updatedOrder.save({ session });
    }

    // Commit the transaction to apply the changes
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: `Order updated successfully`,
      updatedOrder,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error("Error updating order: " + error.message);
  }
};

// Delete and order
const deleteOrder = async (orderId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the order by ID
    const order = await Order.findById(orderId)
      .populate("items.productId")
      .populate("items.variantId");

    if (!order) throw new Error("Order not found");

    // Restore stock for each item in the order
    for (const item of order.items) {
      const { productId, variantId, quantity } = item;

      const product = await Product.findById(productId);
      if (!product) throw new Error(`Product not found for item ${productId}`);

      if (product.variants.length === 0) {
        // If the product doesn't have variants, restore the stock to the product
        await Product.updateOne(
          { _id: productId },
          { $inc: { finalStock: quantity } },
          { session },
        );
      } else {
        // If the product has variants, find the specific variant and restore the stock
        const variant = product.variants.find(
          (v) => v._id.toString() === variantId.toString(),
        );
        if (!variant)
          throw new Error(`Variant not found for product ${productId}`);

        await Product.updateOne(
          { _id: productId, "variants._id": variantId },
          { $inc: { "variants.$.stock": quantity } },
          { session },
        );
      }
    }

    // Delete the order after updating stock
    await Order.findByIdAndDelete(orderId, { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return { message: "Order deleted successfully, stock updated" };
  } catch (error) {
    // Abort the transaction if there's an error
    await session.abortTransaction();
    session.endSession();
    throw new Error(
      "Error deleting order and updating stock: " + error.message,
    );
  }
};

const getOrderByOrderNo = async (orderNo) => {
  try {
    const order = await Order.findOne({ orderNo })
      .populate("userId")
      .populate({
        path: "items.productId",
        select:
          "-sizeChart -longDesc -shortDesc -shippingReturn -videoUrl -flags -metaTitle -metaDescription -metaKeywords -searchTags",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .populate({
        path: "items.variantId",
      })
      .sort({ createdAt: -1 })
      .lean();

    if (!order) {
      throw new Error("Order not found");
    }

    // Collect all unique size IDs for the selected variants
    const sizeIds = new Set();
    order.items.forEach((item) => {
      if (item.productId && item.productId.variants.length > 0) {
        const matchedVariant = item.productId.variants.find(
          (variant) => variant._id.toString() === item.variantId.toString(),
        );
        if (matchedVariant && matchedVariant.size) {
          sizeIds.add(matchedVariant.size);
        }
      }
    });

    // Fetch all size names in one query
    const sizes = await ProductSizeModel.find({
      _id: { $in: Array.from(sizeIds) },
    })
      .select("name")
      .lean();
    const sizeMap = new Map(
      sizes.map((size) => [size._id.toString(), size.name]),
    );

    // Clean up and assign size names
    order.items = order.items.map((item) => {
      if (item.productId && item.productId.variants) {
        item.productId.variants = item.productId.variants.filter(
          (variant) => variant._id.toString() === item.variantId.toString(),
        );

        if (item.productId.variants.length > 0) {
          const variant = item.productId.variants[0];
          const sizeId = variant.size;
          variant.sizeName = sizeMap.get(sizeId.toString()) || "N/A";
        }
      }
      return item;
    });

    return order;
  } catch (error) {
    throw new Error("Error fetching order by orderNo: " + error.message);
  }
};

const getOrdersByUserId = async (userId) => {
  try {
    const orders = await Order.find({ userId })
      .populate({
        path: "items.productId",
        select:
          "-sizeChart -longDesc -shortDesc -shippingReturn -videoUrl -flags -metaTitle -metaDescription -metaKeywords -searchTags",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .populate({
        path: "items.variantId",
      })
      .sort({ createdAt: -1 })
      .lean();

    const totalOrders = orders.length;

    if (totalOrders === 0) {
      throw new Error("No orders found for this user");
    }

    // Collect all unique size IDs from all orders
    const sizeIds = new Set();

    orders.forEach((order) => {
      order.items?.forEach((item) => {
        if (item?.productId?.variants?.length > 0 && item?.variantId) {
          const matchedVariant = item.productId.variants.find(
            (variant) =>
              variant?._id?.toString() === item.variantId?.toString(),
          );

          if (matchedVariant?.size) {
            sizeIds.add(matchedVariant.size);
          }
        }
      });
    });

    // Fetch all size names in one query
    const sizes = await ProductSizeModel.find({
      _id: { $in: Array.from(sizeIds) },
    })
      .select("name")
      .lean();

    const sizeMap = new Map(
      sizes.map((size) => [size._id.toString(), size.name]),
    );

    // Clean up and assign size names to all orders
    const updatedOrders = orders.map((order) => {
      order.items = order.items.map((item) => {
        if (item?.productId?.variants?.length > 0 && item?.variantId) {
          item.productId.variants = item.productId.variants.filter(
            (variant) =>
              variant?._id?.toString() === item.variantId?.toString(),
          );

          if (item.productId.variants.length > 0) {
            const variant = item.productId.variants[0];
            const sizeId = variant.size;
            variant.sizeName = sizeMap.get(sizeId?.toString()) || "N/A";
          }
        }
        return item;
      });

      return order;
    });

    return {
      totalOrders,
      orders: updatedOrders,
    };
  } catch (error) {
    throw new Error("Error fetching orders by userId: " + error.message);
  }
};

const trackOrderByOrderNoAndPhone = async (orderNo, phone) => {
  const order = await Order.findOne({ orderNo })
    .populate("userId", "phone")
    .populate({
      path: "items.productId",
      select:
        "-sizeChart -longDesc -shortDesc -shippingReturn -videoUrl -flags -metaTitle -metaDescription -metaKeywords -searchTags",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .populate("items.variantId")
    .lean();

  if (!order) {
    throw new Error("Order not found");
  }

  // Get phone from userId or shippingInfo or fallback to order.phone
  const storedPhone =
    order.userId?.phone || order.shippingInfo?.mobileNo || order.phone;

  const normalize = (num) => (num || "").replace(/[^0-9]/g, "").replace(/^88/, "");

  if (normalize(storedPhone) !== normalize(phone)) {
    throw new Error("Phone number does not match order");
  }

  // --- Size logic (no change) ---
  const sizeIds = new Set();
  order.items.forEach((item) => {
    if (item.productId?.variants?.length > 0) {
      const matchedVariant = item.productId.variants.find(
        (variant) => variant._id.toString() === item.variantId.toString()
      );
      if (matchedVariant?.size) {
        sizeIds.add(matchedVariant.size);
      }
    }
  });

  const sizes = await ProductSizeModel.find({
    _id: { $in: Array.from(sizeIds) },
  })
    .select("name")
    .lean();

  const sizeMap = new Map(sizes.map((size) => [size._id.toString(), size.name]));

  order.items = order.items.map((item) => {
    if (item.productId?.variants) {
      item.productId.variants = item.productId.variants.filter(
        (variant) => variant._id.toString() === item.variantId.toString()
      );

      if (item.productId.variants.length > 0) {
        const variant = item.productId.variants[0];
        const sizeId = variant.size;
        variant.sizeName = sizeMap.get(sizeId.toString()) || "N/A";
      }
    }
    return item;
  });

  return order;
};




// Export the functions as an object
module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderByOrderNo,
  getOrdersByUserId,
  trackOrderByOrderNoAndPhone,
};
