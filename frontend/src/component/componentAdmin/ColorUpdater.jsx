import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import useColorStore from "../../store/ColorStore.js"; // Import Zustand store
import useAuthAdminStore from "../../store/AuthAdminStore.js"; // Import your auth store

const ColorUpdater = () => {
  const { token } = useAuthAdminStore(); // Access token from your auth store
  const { colors, isLoading, error, fetchColors, updateColors } = useColorStore(); // Access store data and actions

  const [localColors, setLocalColors] = useState(colors || {
    primaryColor: "",
    secondaryColor: "",
    accentColor: "",
    tertiaryColor: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // For showing success/error messages
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (!colors) fetchColors(); // Fetch colors when the component is mounted
  }, [colors, fetchColors]);

  useEffect(() => {
    if (colors) setLocalColors(colors); // Sync local colors when fetched
  }, [colors]);

  const handleColorChange = (e) => {
    const { name, value } = e.target;
    setLocalColors((prevColors) => ({
      ...prevColors,
      [name]: value,
    }));
  };

  const updateColorData = async () => {
    setLoading(true);
    try {
      await updateColors(localColors, token); // Use the updateColors action
      setSnackbarMessage("Colors updated successfully!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error updating colors:", error);
      setSnackbarMessage("Failed to update colors.");
      setSnackbarSeverity("error");
    } finally {
      setLoading(false);
      setOpenSnackbar(true); // Open the snackbar with the message
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="p-4 shadow-lg rounded-lg  mx-auto">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
        Update Website Theme Color
      </h1>

      {/* Snackbar for Success/Error Messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Color input fields */}
        {[
          { label: "Primary Color", name: "primaryColor" },
          { label: "Secondary Color", name: "secondaryColor" },
          { label: "Accent Color", name: "accentColor" },
          { label: "Tertiary Color", name: "tertiaryColor" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                name={name}
                value={localColors[name]}
                onChange={handleColorChange}
                className="w-12 h-12 border-0 rounded"
              />
              <input
                type="text"
                name={name}
                value={localColors[name]}
                onChange={handleColorChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder={`#${name === 'primaryColor' ? '000000' : 'ffffff'}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={updateColorData}
          variant="contained"
          className="px-10 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Update Colors"}
        </Button>
      </div>
    </div>
  );
};

export default ColorUpdater;

