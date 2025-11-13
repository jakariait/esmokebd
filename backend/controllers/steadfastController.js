// controllers/steadfastController.js
const {
  createSteadfastOrderService,
  getSteadfastOrderStatusByInvoiceService,
} = require("../services/steadfastService");

const createSteadfastOrder = async (req, res) => {
  try {
    const response = await createSteadfastOrderService(req.body);
    res.status(200).json({ status: "success", data: response });
  } catch (err) {
    console.error("Steadfast order error:", err.response?.data || err.message);
    res.status(500).json({
      status: "error",
      message: err.response?.data?.message || "Something went wrong",
    });
  }
};

const getSteadfastOrderStatusByInvoice = async (req, res) => {
  try {
    const { invoice } = req.query;  // <-- use req.query here
    if (!invoice) {
      return res.status(400).json({ status: "error", message: "Invoice parameter is required" });
    }

    const response = await getSteadfastOrderStatusByInvoiceService(invoice);
    res.status(200).json({ status: "success", data: response });
  } catch (err) {
    console.error("Steadfast status fetch error:", err.response?.data || err.message);
    res.status(500).json({
      status: "error",
      message: err.response?.data?.message || "Unable to fetch order status",
    });
  }
};

module.exports = {
  createSteadfastOrder,
  getSteadfastOrderStatusByInvoice
};
