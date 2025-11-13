const { checkCourierByPhone } = require("../services/courierService");

const handleCourierCheck = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    const result = await checkCourierByPhone(phone);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Courier check failed", error });
  }
};

module.exports = { handleCourierCheck };
