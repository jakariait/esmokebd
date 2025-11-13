const asyncHandler = require("express-async-handler");
const userService = require("../services/UserService");
const UserModel = require("../models/UserModel");
const generateToken = require("../utility/generateToken");

// 🔐 Login user (email or phone)
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const user = await UserModel.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    }).select("+password");

    if (user && (await user.comparePassword(password))) {
      res.status(200).json({
        message: "Login successful",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email/phone or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// 👤 Create user
const createUser = asyncHandler(async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    const token = generateToken(user._id); // ✅ use the helper

    res.status(201).json({
      message: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Email or phone already exists" });
    } else {
      res.status(500).json({
        message: "Failed to create user",
        error: error.message,
      });
    }
  }
});

// 📤 Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    // Count the number of registered users
    const userCount = users.length;

    if (userCount === 0) {
      return res.status(200).json({ message: "No users found", userCount });
    }

    res.status(200).json({
      message: "Users retrieved successfully",
      userCount, // Include the user count in the response
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

// 🔍 Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: error.message });
  }
});

// ✏️ Update user
const updateUser = asyncHandler(async (req, res) => {
  try {
    // 👉 Handle userImage update if file is uploaded
    if (req.files && req.files.userImage && req.files.userImage.length > 0) {
      req.body.userImage = req.files.userImage[0].filename;
    }

    const user = await userService.updateUser(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Email or phone already exists" });
    } else {
      res.status(500).json({
        message: "Failed to update user",
        error: error.message,
      });
    }
  }
});

// ❌ Delete user
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
});

// 👤 Get logged-in user
const getLoggedInUser = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      message: "User profile retrieved",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get user profile", error: error.message });
  }
});

const requestAccountDeletion = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // Assuming auth middleware sets req.user

    const updatedUser = await userService.updateUser(userId, {
      accountDeletion: {
        requested: true,
        requestedAt: new Date(),
      },
    });

    res.status(200).json({
      message: "Account deletion request submitted",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to request account deletion",
      error: error.message,
    });
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id; // From your auth middleware
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current and new passwords are required" });
  }

  const result = await userService.changePassword(
    userId,
    currentPassword,
    newPassword,
  );
  res.json(result);
});

module.exports = {
  loginUser,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getLoggedInUser,
  requestAccountDeletion,
  changePassword
};
