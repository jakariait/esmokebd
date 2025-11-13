const axios = require("axios");

const sendTelegramMessage = async (message) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error(
        "Telegram bot token or chat ID is not configured in environment variables.",
      );
      return;
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const params = {
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    };

    await axios.get(url, { params });
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
};

module.exports = sendTelegramMessage;
