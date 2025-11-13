const marqueeService = require("../services/MarqueeService");

const getMessages = async (req, res) => {
  try {
    const result = await marqueeService.getActiveMessages();
    if (!result) {
      return res.status(404).json({ message: "No marquee message set found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to get marquee messages", error: error.message });
  }
};

const updateMessageSet = async (req, res) => {
  try {
    const existingSet = await marqueeService.getActiveMessages();
    if (!existingSet) {
      return res.status(404).json({ message: "No marquee message set to update" });
    }

    // Update the messages
    const result = await marqueeService.updateMessageSet(existingSet._id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: "Failed to update message set", error: error.message });
  }
};

module.exports = {
  getMessages,
  updateMessageSet,
};
