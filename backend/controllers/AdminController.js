const asyncHandler = require("express-async-handler");
const adminService = require("../services/AdminService");
const AdminModel = require("../models/AdminModel");
const generateToken = require("../utility/generateToken");

// Login admin
const loginAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.status(200).json({
        message: "Login successful",
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          token: generateToken(admin._id),
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// Get all admins
const getAllAdmins = asyncHandler(async (req, res) => {
  try {
    const admins = await adminService.getAllAdmins();

    if (admins.length === 0) {
      return res.status(200).json({ message: "No admins found"});
    }

    res.status(200).json({
      message: "Admins retrieved successfully",
      admins,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admins", error: error.message });
  }
});


// Get admin by ID
const getAdminById = asyncHandler(async (req, res) => {
  try {
    const admin = await adminService.getAdminById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({
      message: "Admin retrieved successfully",
      admin,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin", error: error.message });
  }
});

// Create admin
const createAdmin = asyncHandler(async (req, res) => {
  try {
    const admin = await adminService.createAdmin(req.body);
    res.status(201).json({
      message: "Admin created successfully",
      admin,
    });
  } catch (error) {
    console.error("Error creating admin:", error); // <-- this line

    if (error.code === 11000) { // Duplicate key error from MongoDB
      res.status(400).json({ message: "Email and Phone Number already exists" });
    } else {
      res.status(500).json({ message: "Failed to create admin", error: error.message });
    }
  }
});

// Update admin
const updateAdmin = asyncHandler(async (req, res) => {
  try {
    const admin = await adminService.updateAdmin(req.params.id, req.body);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({
      message: "Admin updated successfully",
      admin,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update admin", error: error.message });
  }
});

// Delete admin
const deleteAdmin = asyncHandler(async (req, res) => {
  try {
    const admin = await adminService.deleteAdmin(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete admin", error: error.message });
  }
});

const getLoggedInAdmin = (req, res) => {
  const admin = req.admin; // Admin data is attached to req by authenticateToken middleware
  res.json({ admin }); // Send the admin data as response
};



module.exports = {
  loginAdmin,
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getLoggedInAdmin
};
