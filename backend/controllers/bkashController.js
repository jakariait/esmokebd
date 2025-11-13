const bkashService = require("../services/bkashService");

const createPayment = async (req, res) => {
  try {
    const { amount, payerReference, callbackURL } = req.body;

    const data = await bkashService.createPayment(amount, payerReference, callbackURL);

    res.status(200).json({
      paymentID: data.paymentID,
      bkashURL: data.bkashURL,
    });
  } catch (error) {
    console.error("Create Payment Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to create payment" });
  }
};


const executePayment = async (req, res) => {
  try {
    const { paymentID } = req.body;
    const data = await bkashService.executePayment(paymentID);

    res.status(200).json(data);
  } catch (error) {
    console.error("Execute Payment Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to execute payment" });
  }
};

// Controller for querying payment status
const queryPaymentStatus = async (req, res) => {
  const { paymentID } = req.body;

  if (!paymentID) {
    return res.status(400).json({
      error: "PaymentID is required to query the payment status",
    });
  }

  try {
    const paymentStatus = await bkashService.queryPayment(paymentID);  // Corrected this line

    if (paymentStatus.error) {
      return res.status(500).json({
        error: paymentStatus.error,
      });
    }

    return res.status(200).json(paymentStatus);
  } catch (error) {
    console.error("Error querying payment status:", error);
    return res.status(500).json({
      error: "Failed to query payment status",
    });
  }
};

module.exports = {
  createPayment,
  executePayment,
  queryPaymentStatus
};
