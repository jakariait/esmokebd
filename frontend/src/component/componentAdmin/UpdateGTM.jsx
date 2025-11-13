import React, { useState, useEffect } from "react";
import useAuthAdminStore from "../../store/AuthAdminStore.js";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const apiURL = import.meta.env.VITE_API_URL;

const UpdateGTM = () => {
  const [gtmId, setGtmId] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" | "error"
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { token } = useAuthAdminStore();

  useEffect(() => {
    const fetchGTM = async () => {
      try {
        const res = await fetch(`${apiURL}/getGTM`);
        if (!res.ok) throw new Error("Failed to fetch GTM config");
        const data = await res.json();
        setGtmId(data.googleTagManagerId || "");
        setIsActive(data.isActive || false);
      } catch {
        // ignore errors here
      }
    };
    fetchGTM();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${apiURL}/updateGTM`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          googleTagManagerId: gtmId,
          isActive,
        }),
      });

      if (!res.ok) throw new Error(`Error: ${res.statusText}`);

      setSnackbarSeverity("success");
      setSnackbarMessage("GTM config updated successfully.");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || "Failed to update GTM config.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <>
      <div className="max-w-md   p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
          Update GTM Configuration
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="gtmId"
              className="block text-gray-700 mb-2 font-medium"
            >
              Google Tag Manager ID
            </label>
            <input
              id="gtmId"
              type="text"
              value={gtmId}
              onChange={(e) => setGtmId(e.target.value)}
              placeholder="GTM-XXXXXXX"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none "
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isActive"
              className="text-gray-700 font-medium cursor-pointer"
            >
              Active
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 cursor-pointer primaryBgColor rounded-md accentTextColor font-semibold transition  ${
              loading ? "cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UpdateGTM;
