import React, { useEffect, useState } from "react";
import useAuthAdminStore from "../../store/AuthAdminStore.js";
import { Snackbar, Alert } from "@mui/material";
import Skeleton from "react-loading-skeleton";

const OrderStatusUpdate = ({ orderId, onUpdate }) => {
  const { token } = useAuthAdminStore();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [specialDiscount, setSpecialDiscount] = useState(0);
  const [adminNote, setAdminNote] = useState("");
  const [orderStatus, setOrderStatus] = useState("pending");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          const order = data.order;
          setAdvanceAmount(order.advanceAmount || 0);
          setSpecialDiscount(order.specialDiscount || 0);
          setAdminNote(order.adminNote || "");
          setOrderStatus(order.orderStatus || "pending");
        } else {
          setSnackbarMessage(data.message || "Failed to load order");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      } catch (err) {
        console.error(err);
        setSnackbarMessage("Error fetching order details.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, apiUrl, token]);

  const handleSubmit = async () => {
    if (advanceAmount < 0 || specialDiscount < 0) {
      setSnackbarMessage("Amounts cannot be negative.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      setSubmitting(true);

      const updatedData = {
        advanceAmount,
        specialDiscount,
        adminNote,
        orderStatus,
      };

      const res = await fetch(`${apiUrl}/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSnackbarMessage("Order updated successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        if (onUpdate) onUpdate(data.order);
      } else {
        setSnackbarMessage(data.message || "Failed to update order");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Something went wrong while updating the order.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className=" h-40">
        <Skeleton height={100} width={"100%"} />

        <div className={"grid grid-cols-3 gap-1"}>
          <Skeleton height={40} width={"100%"} />
          <Skeleton height={40} width={"100%"} />
          <Skeleton height={40} width={"100%"} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg shadow bg-white">
      <div className="mt-4">
        <label className="block mb-1">Admin Note:</label>
        <textarea
          rows="3"
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          placeholder="Admin note (visible to admins only)"
          className="w-full p-4 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div>
          <label className="block mb-1">Advance Amount:</label>
          <input
            type="number"
            min={0}
            value={advanceAmount}
            onChange={(e) => setAdvanceAmount(Number(e.target.value))}
            className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block mb-1">Special Discount:</label>
          <input
            type="number"
            min={0}
            value={specialDiscount}
            onChange={(e) => setSpecialDiscount(Number(e.target.value))}
            className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-red-500 mb-1">Order Status:</label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="intransit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="primaryBgColor accentTextColor px-4 py-2 rounded-md disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>

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

export default OrderStatusUpdate;
