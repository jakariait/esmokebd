// const axios = require("axios");
// const { v4: uuidv4 } = require("uuid");
//
// let tokenCache = {
//   token: null,
//   expiry: null,
// };
//
// // Load bKash config from environment variables
// const BkashConfig = {
//   base_url: process.env.BKASH_BASE_URL,
//   username: process.env.BKASH_USERNAME,
//   password: process.env.BKASH_PASSWORD,
//   app_key: process.env.BKASH_APP_KEY,
//   app_secret: process.env.BKASH_APP_SECRET,
//   client_url: process.env.BKASH_CLIENT_URL,
// };
//
// // Token request body
// const tokenParameters = () => ({
//   app_key: BkashConfig.app_key,
//   app_secret: BkashConfig.app_secret,
// });
//
// // Token request headers
// const tokenHeaders = () => ({
//   "Content-Type": "application/json",
//   Accept: "application/json",
//   username: BkashConfig.username,
//   password: BkashConfig.password,
// });
//
// // Authenticated request headers
// const authHeaders = async () => ({
//   "Content-Type": "application/json",
//   Accept: "application/json",
//   Authorization: `Bearer ${await getToken()}`,
//   "X-App-Key": BkashConfig.app_key,
// });
//
// // Get new or cached token
// const getToken = async () => {
//   const now = new Date();
//
//   if (tokenCache.token && tokenCache.expiry > now) {
//     return tokenCache.token;
//   }
//
//   try {
//     const tokenUrl = `${BkashConfig.base_url}/tokenized/checkout/token/grant`;
//
//     const response = await axios.post(tokenUrl, tokenParameters(), {
//       headers: tokenHeaders(),
//     });
//
//     const { id_token, expires_in } = response.data;
//
//     if (!id_token) {
//       console.error("No id_token received from bKash API");
//       return null;
//     }
//
//     tokenCache.token = id_token;
//     tokenCache.expiry = new Date(now.getTime() + expires_in * 1000);
//
//     return id_token;
//   } catch (error) {
//     console.error(
//       "Error fetching token:",
//       error?.response?.data || error.message,
//     );
//     throw new Error("Failed to fetch token");
//   }
// };
//
// // Create payment request
// const createPayment = async (
//   amount,
//   payerReference = "guestUser",
//   callbackURL,
// ) => {
//   try {
//     if (!amount || amount < 1) {
//       return {
//         statusCode: 400,
//         message: "Amount is required and must be at least 1 BDT",
//       };
//     }
//
//     const payload = {
//       mode: "0011",
//       payerReference,
//       callbackURL,
//       amount,
//       currency: "BDT",
//       intent: "sale",
//       merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 6),
//     };
//
//     const response = await axios.post(
//       `${BkashConfig.base_url}/tokenized/checkout/create`,
//       payload,
//       { headers: await authHeaders() },
//     );
//
//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       console.error("Create Payment Error - response:", error.response.data);
//     } else if (error.request) {
//       console.error("Create Payment Error - no response:", error.request);
//     } else {
//       console.error("Create Payment Error - general:", error.message);
//     }
//
//     throw new Error("Failed to create payment");
//   }
// };
//
// // Execute payment request
// const executePayment = async (paymentID) => {
//   if (!paymentID) {
//     return { error: "PaymentID is required to execute the payment" };
//   }
//
//   try {
//     const payload = { paymentID };
//
//     const response = await axios.post(
//       `${BkashConfig.base_url}/tokenized/checkout/execute`,
//       payload,
//       { headers: await authHeaders() },
//     );
//
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Execute Payment Error:",
//       error?.response?.data || error.message,
//     );
//     return { error: "Failed to execute payment" };
//   }
// };
//
// // Query Payment Request
// const queryPayment = async (paymentID) => {
//   if (!paymentID) {
//     return { error: "PaymentID is required to query the payment status" };
//   }
//
//   try {
//     const url = `${BkashConfig.base_url}/tokenized/checkout/payment/status`;
//     const payload = { paymentID };
//
//     const response = await axios.post(url, payload, {
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization: `Bearer ${await getToken()}`,
//         "X-App-Key": BkashConfig.app_key,
//       },
//     });
//
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error querying payment status:",
//       error?.response?.data || error.message,
//     );
//     return { error: "Failed to query payment status" };
//   }
// };
//
// module.exports = {
//   createPayment,
//   executePayment,
//   queryPayment,
// };

const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const BkashConfig = require("../models/BkashConfigModel"); // your Mongoose model

let tokenCache = {
  token: null,
  expiry: null,
};

// Cache the bKash config for some time (e.g., 10 minutes)
let bkashConfigCache = {
  config: null,
  expiry: null,
};

// Function to get bKash config from your API endpoint
// const getBkashConfig = async () => {
//   const now = new Date();
//
//   if (bkashConfigCache.config && bkashConfigCache.expiry > now) {
//     return bkashConfigCache.config;
//   }
//
//   try {
//     const response = await axios.get(process.env.BKASH_CONFIG_API_URL);
//     const config = response.data.data;
//
//     if (!config || !config.isActive) {
//       throw new Error("No active bKash config found from API");
//     }
//
//     // Cache config for 10 minutes
//     bkashConfigCache.config = config;
//     bkashConfigCache.expiry = new Date(now.getTime() + 10 * 60 * 1000);
//
//     return config;
//   } catch (error) {
//     console.error("Failed to fetch bKash config:", error.message);
//     throw error;
//   }
// };

const getBkashConfig = async () => {
  const now = new Date();

  if (bkashConfigCache.config && bkashConfigCache.expiry > now) {
    return bkashConfigCache.config;
  }

  try {
    const config = await BkashConfig.findOne({ isActive: true });

    if (!config) {
      throw new Error("No active bKash config found in DB");
    }

    // Cache config for 10 minutes
    bkashConfigCache.config = config;
    bkashConfigCache.expiry = new Date(now.getTime() + 10 * 60 * 1000);

    return config;
  } catch (error) {
    console.error("Failed to fetch bKash config from DB:", error.message);
    throw error;
  }
};

// Token request body builder
const tokenParameters = (config) => ({
  app_key: config.appKey,
  app_secret: config.appSecret,
});

// Token request headers builder
const tokenHeaders = (config) => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  username: config.username,
  password: config.password,
});

// Authenticated request headers builder
const authHeaders = async () => {
  const config = await getBkashConfig();
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${await getToken()}`,
    "X-App-Key": config.appKey,
  };
};

// Get new or cached token
const getToken = async () => {
  const now = new Date();

  if (tokenCache.token && tokenCache.expiry > now) {
    return tokenCache.token;
  }

  try {
    const config = await getBkashConfig();

    const tokenUrl = `${config.baseUrl}/tokenized/checkout/token/grant`;

    const response = await axios.post(tokenUrl, tokenParameters(config), {
      headers: tokenHeaders(config),
    });

    const { id_token, expires_in } = response.data;

    if (!id_token) {
      console.error("No id_token received from bKash API");
      return null;
    }

    tokenCache.token = id_token;
    tokenCache.expiry = new Date(now.getTime() + expires_in * 1000);

    return id_token;
  } catch (error) {
    console.error(
      "Error fetching token:",
      error?.response?.data || error.message,
    );
    throw new Error("Failed to fetch token");
  }
};

// Create payment request
const createPayment = async (
  amount,
  payerReference = "guestUser",
  callbackURL,
) => {
  try {
    if (!amount || amount < 1) {
      return {
        statusCode: 400,
        message: "Amount is required and must be at least 1 BDT",
      };
    }

    const config = await getBkashConfig();

    const payload = {
      mode: "0011",
      payerReference,
      callbackURL,
      amount,
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 6),
    };

    const response = await axios.post(
      `${config.baseUrl}/tokenized/checkout/create`,
      payload,
      { headers: await authHeaders() },
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Create Payment Error - response:", error.response.data);
    } else if (error.request) {
      console.error("Create Payment Error - no response:", error.request);
    } else {
      console.error("Create Payment Error - general:", error.message);
    }

    throw new Error("Failed to create payment");
  }
};

// Execute payment request
const executePayment = async (paymentID) => {
  if (!paymentID) {
    return { error: "PaymentID is required to execute the payment" };
  }

  try {
    const config = await getBkashConfig();

    const payload = { paymentID };

    const response = await axios.post(
      `${config.baseUrl}/tokenized/checkout/execute`,
      payload,
      { headers: await authHeaders() },
    );

    return response.data;
  } catch (error) {
    console.error(
      "Execute Payment Error:",
      error?.response?.data || error.message,
    );
    return { error: "Failed to execute payment" };
  }
};

// Query Payment Request
const queryPayment = async (paymentID) => {
  if (!paymentID) {
    return { error: "PaymentID is required to query the payment status" };
  }

  try {
    const config = await getBkashConfig();

    const url = `${config.baseUrl}/tokenized/checkout/payment/status`;
    const payload = { paymentID };

    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${await getToken()}`,
        "X-App-Key": config.appKey,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error querying payment status:",
      error?.response?.data || error.message,
    );
    return { error: "Failed to query payment status" };
  }
};

module.exports = {
  createPayment,
  executePayment,
  queryPayment,
};
