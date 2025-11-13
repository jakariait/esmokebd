const pageContentService = require("../services/PageContentService");

const getPageContent = async (req, res) => {
  const { page } = req.params;
  try {
    const data = await pageContentService.getPageContent(page);
    if (!data) return res.status(404).json({ message: "Page content not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updatePageContent = async (req, res) => {
  const { page } = req.params;
  const { content } = req.body;
  try {
    const updated = await pageContentService.updatePageContent(page, content);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getPageContent,
  updatePageContent,
};
