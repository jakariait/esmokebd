const NewslettersModel = require("../models/NewslettersModel");

// Subscribe to Newsletter

const subscribeEmail = async (email) => {
  try {
    // Check if the email already exists
    const existingEmail = await NewslettersModel.findOne({ Email: email });
    if (existingEmail) {
      throw new Error("Email already subscribed!");
    }
    // Save email
    const newSubscription = new NewslettersModel({ Email: email });
    await newSubscription.save();
    return { message: "Successfully subscribed!" };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all Subscribers

const getAllSubscribers = async () => {
  try {
    return await NewslettersModel.find({});
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete subscriber by their email address
const deleteSubscriber = async (email) => {
  try {
    // Find and delete the subscriber from the database
    const deletedSubscriber = await NewslettersModel.findOneAndDelete({ Email: email });
    if (!deletedSubscriber) {
      // If no subscriber found
      throw new Error("Subscriber not found");
    }
    // Return a success message if the subscriber was deleted
    return { success: true, message: "Subscriber deleted successfully" };
  } catch (error) {
    // Handle any error that occurs
    throw new Error(error.message);
  }
};

module.exports = { subscribeEmail, getAllSubscribers, deleteSubscriber };
