import {
  FaUser,
  FaLock,
  FaEyeSlash,
  FaEye,
  FaEnvelope,
  FaHome,
} from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthUserStore from "../../store/AuthUserStore.js"; // Import the auth store
import useCartStore from "../../store/useCartStore.js"; // Import the cart store
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const apiUrl = import.meta.env.VITE_API_URL;

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    emailOrPhone: "",
    address: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login, loading: authLoading, error: authError } = useAuthUserStore(); // Get login, loading, and error from auth store
  const { syncCartToDB, loadCartFromBackend } = useCartStore(); // Get cart actions
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistrationLoading(true);
    setRegistrationError(null);

    const payload = {
      fullName: formData.fullName,
      address: formData.address,
      password: formData.password,
    };

    if (formData.emailOrPhone.includes("@")) {
      payload.email = formData.emailOrPhone;
    } else {
      payload.phone = formData.emailOrPhone;
    }

    try {
      const res = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // Attempt to log in the user after successful registration
        await login(formData.emailOrPhone, formData.password);
        const token = localStorage.getItem("user_token");

        if (token) {
          try {
            await syncCartToDB(token);
            await loadCartFromBackend(token);
            navigate("/user/home");
          } catch (cartError) {
            setSnackbarMessage(
              "Registration successful, but there was a problem loading your cart. Please try again.",
            );
            setSnackbarOpen(true);
            navigate("/user/home"); // Still navigate even if cart load fails
          }
        } else {
          alert(
            "Registration successful, but automatic login failed. Please log in manually.",
          );
          navigate("/login"); // Redirect to login page if auto-login fails
        }
      } else {
        setRegistrationError(data.message || "Registration failed!");
      }
    } catch (error) {
      setRegistrationError("Something went wrong. Please try again.");
    } finally {
      setRegistrationLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white px-4 mt-20 mb-20 md:m-20">
      <div className="bg-[#EEF5F6] rounded-2xl shadow-md p-8 w-full max-w-md text-center relative">
        {/* Lock Icon */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-indigo-200 to-blue-200 p-4 rounded-full">
            <FaRegEdit className="primaryTextColor text-5xl" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold m-7">Register Account</h2>

        {/* Registration Error Message */}
        {registrationError && (
          <div className="bg-red-100 text-red-600 px-4 py-2 mb-4 rounded">
            {registrationError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Full Name */}
          <div className="flex items-center bg-white rounded-md shadow-sm px-4 py-4">
            <FaUser className="primaryTextColor mr-5 text-2xl" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name*"
              className="w-full outline-none text-sm bg-transparent"
              required
            />
          </div>

          {/* Email or Phone */}
          <div className="flex items-center bg-white rounded-md shadow-sm px-4 py-4">
            <FaEnvelope className="primaryTextColor mr-5 text-2xl" />
            <input
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              placeholder="Email or Phone Number*"
              className="w-full outline-none text-sm bg-transparent"
              required
            />
          </div>

          {/* Address */}
          <div className="flex items-center bg-white rounded-md shadow-sm px-4 py-4">
            <FaHome className="primaryTextColor mr-5 text-2xl" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full outline-none text-sm bg-transparent"
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-white rounded-md shadow-sm px-4 py-4 relative">
            <FaLock className="primaryTextColor mr-5 text-2xl" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Set Password*"
              className={`w-full outline-none bg-transparent pr-10 text-lg ${
                showPassword ? "font-bold" : ""
              } placeholder:text-sm`}
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-md mt-2 primaryBgColor accentTextColor"
            disabled={registrationLoading || authLoading}
          >
            {registrationLoading || authLoading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Sign In Redirect */}
        <p className="text-sm mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login">
            <button className="primaryTextColor font-medium hover:underline cursor-pointer">
              Sign in
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

export default RegisterForm;
