import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import useAuthUserStore from "../../store/AuthUserStore.js";
import useCartStore from "../../store/useCartStore.js";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthUserStore();
  const { syncCartToDB, loadCartFromBackend } = useCartStore();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(emailOrPhone, password);

    const token = localStorage.getItem("user_token");

    if (token) {
      try {
        await syncCartToDB(token);
        await loadCartFromBackend(token);
        navigate("/user/home");
      } catch (err) {
        setSnackbarMessage(
          "There was a problem loading your cart. Please try again.",
        );
        setSnackbarOpen(true);
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-white px-4 mt-20 mb-20 md:m-20">
      <div className="bg-[#EEF5F6] rounded-2xl shadow-md p-8 w-full max-w-md text-center relative">
        {/* Lock Icon */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
          <div className="accentBgColor p-4 rounded-full">
            <FaLock className="primaryTextColor text-5xl" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold m-7">Sign in</h2>

        {/* Error Message from Auth */}
        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 mb-4 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Email / Phone */}
          <div className="flex items-center bg-white rounded-md shadow-sm px-4 py-4">
            <FaUser className="primaryTextColor mr-5 text-2xl " />
            <input
              type="text"
              placeholder="Email or Phone Number"
              className="w-full outline-none text-sm bg-transparent"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-white rounded-md shadow-sm px-4 py-4">
            <FaLock className="primaryTextColor mr-5 text-2xl " />
            <input
              type="password"
              placeholder="Password"
              className="w-full outline-none text-sm bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Remember Me & Forgot */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <Link
              to="/forgot-password"
              className="primaryTextColor font-medium hover:underline"
            >
              Forgotten password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-md mt-2 primaryBgColor accentTextColor"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Register */}
        <p className="text-sm mt-6 text-gray-600">
          Don’t have any account?{" "}
          <Link to="/register">
            <button className="primaryTextColor font-medium hover:underline cursor-pointer">
              Register account
            </button>
          </Link>
        </p>
      </div>

      {/* Snackbar for cart sync/load error */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginForm;
