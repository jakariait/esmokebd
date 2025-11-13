const newsletterService = require("../services/NewsletterService");

// Controller for subscribing an email

const subscribe = async (req, res) => {
  try {
    const { Email } = req.body;
    const response = await newsletterService.subscribeEmail(Email);
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller for getting all subscribers
const getSubscription = async (req, res) => {
  try {
    const subscribers = await newsletterService.getAllSubscribers();
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller for delete subscribers from list by their email
const deleteSubscriber = async (req, res) => {
  try {
    const { Email } = req.body; // Get the email from the request body

    if (!Email) {
      // If Email is not provided, return a 400 error
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Call the service to delete the subscriber
    const result = await newsletterService.deleteSubscriber(Email);
    // If successful, return a 200 response with the result message
    return res.status(200).json(result);
  } catch (error) {
    // Catch any errors and return a 500 server error
    return res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { subscribe, getSubscription, deleteSubscriber };
