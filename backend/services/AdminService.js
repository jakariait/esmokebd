const AdminModel = require("../models/AdminModel");
const bcrypt = require("bcryptjs");

const adminService = {
  getAllAdmins: async () => {
    return await AdminModel.find().select("-password");
  },

  getAdminById: async (id) => await AdminModel.findById(id).select("-password"),

  createAdmin: async (adminData) => await AdminModel.create(adminData),

  updateAdmin: async (id, adminData) => {
    const updateData = { ...adminData };

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    return await AdminModel.findByIdAndUpdate(id, updateData, { new: true });
  },

  deleteAdmin: async (id) => await AdminModel.findByIdAndDelete(id),
};

module.exports = adminService;
