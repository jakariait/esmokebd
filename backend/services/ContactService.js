const Contact = require('../models/ContactModel');

const createContact = async (contactData) => {
  try {
    const contact = new Contact(contactData);
    await contact.save();
    return contact;
  } catch (error) {
    throw new Error('Error creating contact: ' + error.message);
  }
};

const getAllContacts = async () => {
  try {
    return await Contact.find();
  } catch (error) {
    throw new Error('Error retrieving contacts: ' + error.message);
  }
};

const getContactById = async (id) => {
  try {
    return await Contact.findById(id);
  } catch (error) {
    throw new Error('Error retrieving contact: ' + error.message);
  }
};

const updateContact = async (id, contactData) => {
  try {
    return await Contact.findByIdAndUpdate(id, contactData, { new: true });
  } catch (error) {
    throw new Error('Error updating contact: ' + error.message);
  }
};

const deleteContact = async (id) => {
  try {
    const result = await Contact.findByIdAndDelete(id);
    return result;
  } catch (error) {
    throw new Error('Error deleting contact: ' + error.message);
  }
};



module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
