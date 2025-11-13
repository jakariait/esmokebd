const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const sendEmail = require("../utility/sendEmail");

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email }).select(
      "+resetOTP +resetOTPExpiry",
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    await user.save();

    // Send OTP email
    const message = `Your password reset OTP is: ${otp}. It will expire in 10 minutes.`;
    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      text: message,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPasswordWithOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, OTP and new password are required" });
  }

  try {
    // Find user with OTP and expiry fields
    const user = await User.findOne({ email }).select(
      "+resetOTP +resetOTPExpiry +password"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate OTP
    if (user.resetOTP !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > user.resetOTPExpiry) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Simply assign the new password
    user.password = newPassword;

    // Clear OTP fields
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;

    // Save user — password will be hashed by Mongoose pre-save hook
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  requestPasswordReset,
  resetPasswordWithOTP,
};
