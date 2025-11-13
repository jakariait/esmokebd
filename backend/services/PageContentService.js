const PageContent = require("../models/PageContent");

const getPageContent = (page) => {
  return PageContent.findOne({ page });
};

const updatePageContent = (page, content) => {
  return PageContent.findOneAndUpdate(
    { page },
    { content },
    { new: true, upsert: true }
  );
};

module.exports = {
  getPageContent,
  updatePageContent,
};
