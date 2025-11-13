const axios = require("axios");
const SteadfastConfig = require("../models/SteadfastConfigModel");

const configCache = {
  config: null,
  expiry: null,
};

const getSteadfastConfig = async () => {
  const now = new Date();

  if (configCache.config && configCache.expiry > now) {
    return configCache.config;
  }

  const config = await SteadfastConfig.findOne({ isActive: true });
  if (!config) {
    throw new Error("No active Steadfast config found in DB");
  }

  configCache.config = config;
  configCache.expiry = new Date(now.getTime() + 10 * 60 * 1000); // Cache for 10 minutes

  return config;
};

const createSteadfastOrderService = async (orderData) => {
  const config = await getSteadfastConfig();

  const {
    invoice,
    recipient_name,
    recipient_phone,
    recipient_address,
    cod_amount,
    note,
  } = orderData;

  const payload = {
    invoice,
    recipient_name,
    recipient_phone,
    recipient_address,
    cod_amount,
    note,
  };

  const response = await axios.post(
    `${config.baseUrl}/create_order`,
    payload,
    {
      headers: {
        "Api-Key": config.apiKey,
        "Secret-Key": config.secretKey,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

const getSteadfastOrderStatusByInvoiceService = async (invoiceId) => {
  const config = await getSteadfastConfig();

  const response = await axios.get(
    `${config.baseUrl}/status_by_invoice/${invoiceId}`,
    {
      headers: {
        "Api-Key": config.apiKey,
        "Secret-Key": config.secretKey,
      },
    }
  );

  return response.data;
};

module.exports = {
  createSteadfastOrderService,
  getSteadfastOrderStatusByInvoiceService,
};
