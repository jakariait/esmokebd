import React, { useEffect, useState } from "react";
import useAuthAdminStore from "../../store/AuthAdminStore.js";
import { Snackbar, Alert } from "@mui/material";
import Skeleton from "react-loading-skeleton";
import Select from "react-select";

const statusOptions = [
  { value: "pending", label: "Pending", color: "blue" }, // yellow-400
  { value: "approved", label: "Approved", color: "#34D399" }, // green-400
  { value: "intransit", label: "In Transit", color: "#60A5FA" }, // blue-400
  { value: "delivered", label: "Delivered", color: "green" }, // purple-400
  { value: "returned", label: "Returned", color: "#F87171" }, // red-400
  { value: "cancelled", label: "Cancelled", color: "red" }, // gray-400
];

// Custom style for react-select to color options and selected value
const customStyles = {
  control: (provided) => ({
    ...provided,
    minWidth: 150,
    backgroundColor: "#f3f4f6", // gray-100
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? state.data.color
      : state.isFocused
        ? "#e0e7ff" // light blue on hover
        : "white",
    color: state.isSelected ? "white" : "black",
    cursor: "pointer",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: state.data.color,
    fontWeight: "bold",
  }),
};

const OrderStatusSelector = ({ orderId, refetchOrders }) => {
  const { token } = useAuthAdminStore();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState("pending");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderStatus = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setOrderStatus(data.order.orderStatus || "pending");
        } else {
          setSnackbarMessage(data.message || "Failed to load order status");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      } catch (err) {
        console.error(err);
        setSnackbarMessage("Error fetching order status.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [orderId, apiUrl, token]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSnackbarMessage("Order status updated successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        if (refetchOrders) refetchOrders(); // 🔁 Call the refetch

      } else {
        setSnackbarMessage(data.message || "Failed to update status");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Something went wrong while updating status.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Skeleton height={40} width={180} />;
  }

  // Find the selected option object for react-select
  const selectedOption = statusOptions.find(
    (opt) => opt.value === orderStatus
  );

  return (
    <div className="flex items-center gap-4">
      <Select
        options={statusOptions}
        value={selectedOption}
        onChange={(selected) => setOrderStatus(selected.value)}
        styles={customStyles}
        isDisabled={submitting}
      />

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="primaryBgColor accentTextColor px-4 py-2 rounded-md disabled:opacity-50 cursor-pointer"
      >
        {submitting ? "Saving..." : "Save"}
      </button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OrderStatusSelector;
