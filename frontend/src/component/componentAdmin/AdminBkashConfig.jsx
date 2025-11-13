import React, { useEffect, useState } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import useAuthAdminStore from "../../store/AuthAdminStore.js";

const AdminBkashConfig = () => {
  const [config, setConfig] = useState({
    baseUrl: "",
    appKey: "",
    appSecret: "",
    username: "",
    password: "",
    isActive: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [severity, setSeverity] = useState("success");

  const { token } = useAuthAdminStore();

  const apiUrl = import.meta.env.VITE_API_URL + "/bkash-config";

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.data) {
          setConfig(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch bKash config", error);
      }
    };
    fetchConfig();
  }, [apiUrl, token]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.patch(apiUrl, config, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data) {
        setMessage("bKash config updated successfully!");
        setSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setMessage("Failed to update config.");
      setSeverity("error");
      setSnackbarOpen(true);
      console.error(error);
    }
    setLoading(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <div className=" p-4 bg-white rounded-lg shadow">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
        Update bKash Config
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">
            Base URL
          </span>
          <input
            type="text"
            name="baseUrl"
            value={config.baseUrl}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="https://tokenized.sandbox.bka.sh/v1.2.0-beta"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">
            App Key
          </span>
          <input
            type="text"
            name="appKey"
            value={config.appKey}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Your app key"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">
            App Secret
          </span>
          <input
            type="text"
            name="appSecret"
            value={config.appSecret}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Your app secret"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">
            Username
          </span>
          <input
            type="text"
            name="username"
            value={config.username}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="017xxxxxxxx"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">
            Password
          </span>
          <input
            type="text"
            name="password"
            value={config.password}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Your password"
            required
          />
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isActive"
            checked={config.isActive}
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-700 font-medium">Active</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 primaryBgColor accentTextColor rounded-lg font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminBkashConfig;
