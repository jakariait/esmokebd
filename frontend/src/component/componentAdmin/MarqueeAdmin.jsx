import React, { useEffect, useState } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import useAuthAdminStore from "../../store/AuthAdminStore.js";

const MarqueeAdmin = () => {
  const { token } = useAuthAdminStore();
  const [messages, setMessages] = useState([""]);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const API_URL = `${import.meta.env.VITE_API_URL}/marquee`;

  useEffect(() => {
    const fetchMarquee = async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data) {
          setMessages(res.data.messages || [""]);
          setIsActive(res.data.isActive);
        }
      } catch (err) {
        console.error("Failed to fetch marquee data:", err.message);
      }
    };

    if (token) fetchMarquee();
  }, [token]);

  const handleInputChange = (index, value) => {
    const updated = [...messages];
    updated[index] = value;
    setMessages(updated);
  };

  const addMessage = () => setMessages([...messages, ""]);
  const removeMessage = (index) => {
    const updated = messages.filter((_, i) => i !== index);
    setMessages(updated.length ? updated : [""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(
        API_URL,
        { messages, isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setSnackbar({
        open: true,
        message: "Marquee updated successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to update marquee.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 bg-white rounded shadow">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
        Update Marquee Messages
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={msg}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="flex-1 bg-gray-100 rounded px-3 py-2"
              placeholder={`Message ${index + 1}`}
              required
            />
            <button
              type="button"
              onClick={() => removeMessage(index)}
              className="text-red-500 cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addMessage}
          className="primaryBgColor accentTextColor px-3 py-1 rounded cursor-pointer"
        >
          + Add Message
        </button>

        <div className="flex items-center gap-2 mt-4">
          <label className="font-medium">Active:</label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
          />
        </div>

        <div className={"flex justify-center"}>
          <button
            type="submit"
            disabled={loading}
            className="primaryBgColor accentTextColor px-5 py-2 rounded cursor-pointer"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MarqueeAdmin;
