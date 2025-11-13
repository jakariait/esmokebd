const jwt = require('jsonwebtoken');
const Admin = require('../models/AdminModel');

// Middleware to authenticate the JWT token
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    try {
      // Assuming the decoded token contains the admin ID
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      req.admin = admin; // Attach admin data to the request
      next(); // Continue to the next middleware or route handler
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  });
}

module.exports = {authenticateToken};
