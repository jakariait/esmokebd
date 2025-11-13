const axios = require("axios");

const checkCourierByPhone = async (phone) => {
  try {
    const response = await axios.post(
      `https://bdcourier.com/api/courier-check?phone=${phone}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.BD_COURIER_API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

module.exports = { checkCourierByPhone };
