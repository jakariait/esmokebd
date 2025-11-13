import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const apiUrl = import.meta.env.VITE_API_URL;

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const emailFromQuery = query.get("email");

  const [email] = useState(emailFromQuery || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/reset-password`, {
        email,
        otp,
        newPassword,
      });

      setSnackbar({
        open: true,
        message: res.data.message || "Password reset successful",
        severity: "success",
      });

      // Redirect to login after short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to reset password.",
        severity: "error",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          readOnly
          className="w-full p-2 bg-gray-100 focus:outline-none rounded"
        />
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 bg-gray-100 focus:outline-none rounded"
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 bg-gray-100 focus:outline-none rounded"
          required
        />
        <button
          type="submit"
          className="w-full primaryBgColor accentTextColor py-2 rounded cursor-pointer"
        >
          Reset Password
        </button>
      </form>

      {/* MUI Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
