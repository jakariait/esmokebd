const UserModel = require("../models/UserModel");

const userService = {
  getAllUsers: async () => await UserModel.find(),

  getUserById: async (id) => await UserModel.findById(id),

  createUser: async (userData) => await UserModel.create(userData),

  updateUser: async (id, userData) =>
    await UserModel.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true,
    }),

  deleteUser: async (id) => await UserModel.findByIdAndDelete(id),


  changePassword: async (userId, currentPassword, newPassword) => {
    const user = await UserModel.findById(userId).select("+password");
    if (!user) throw new Error("User not found");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new Error("Current password is incorrect");

    user.password = newPassword;
    await user.save();

    return { message: "Password updated successfully" };
  },

};

module.exports = userService;
