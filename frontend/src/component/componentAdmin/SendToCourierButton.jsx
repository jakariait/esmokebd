import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import useAuthAdminStore from "../../store/AuthAdminStore.js";

const SendToCourierButton = ({ orderData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(orderData.note || "");
  const [sent, setSent] = useState(orderData.courier_status || false);
  const [deliveryStatus, setDeliveryStatus] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const apiURL = import.meta.env.VITE_API_URL;
  const { token } = useAuthAdminStore();

  const sendToSteadfast = async () => {
    try {
      const response = await axios.post(
        `${apiURL}/steadfast/create-order`,
        {
          invoice: orderData.invoice,
          recipient_name: orderData.recipient_name,
          recipient_phone: orderData.recipient_phone,
          recipient_address: orderData.recipient_address,
          cod_amount: orderData.cod_amount,
          note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = response.data;
      const statusCode = result.data.status;

      if (result.status === "success") {
        if (statusCode === 200) {
          // ✅ Update order in DB
          await axios.put(
            `${apiURL}/orders/${orderData.order_id}`,
            {
              sentToCourier: true,
              orderStatus: "intransit",
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setSnackbar({
            open: true,
            message: "✅ Consignment created & order updated successfully!",
            severity: "success",
          });

          setSent(true); // ✅ update local state to disable button
          if (onSuccess) onSuccess();
          setOpen(false);
        } else if (statusCode === 400) {
          const errors = result.data.errors;
          let errorMessage = "❌ Failed to send order:";
          if (errors) {
            errorMessage +=
              "\n" +
              Object.entries(errors)
                .map(([key, value]) => `${key}: ${value.join(", ")}`)
                .join("\n");
          }
          setSnackbar({
            open: true,
            message: errorMessage,
            severity: "error",
          });
        } else {
          setSnackbar({
            open: true,
            message: "⚠️ Unknown status received from the server.",
            severity: "warning",
          });
        }
      } else {
        setSnackbar({
          open: true,
          message: "❌ API call was not successful.",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "❌ Network error while sending order.",
        severity: "error",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    setLoading(true);
    sendToSteadfast();
  };

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/steadfast/get-order-status`,
          {
            params: { invoice: orderData.invoice },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.status === "success") {
          setDeliveryStatus(response.data.data.delivery_status);
        } else {
          console.error("Unexpected response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching order status:", error.message);
      }
    };

    if (sent) {
      fetchOrderStatus();
    }
  }, [sent, orderData.invoice, apiURL, token]);

  return (
    <>
      {/* ✅ Disable if already sent */}
      <button
        className={`primaryBgColor accentTextColor cursor-pointer px-4 py-2 w-34 rounded text-sm ${
          sent ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => setOpen(true)}
        disabled={sent}
      >
        {sent ? (
          <>
            Sent | <span className="font-semibold">{deliveryStatus}</span>
          </>
        ) : (
          "Send to Courier"
        )}
      </button>

      {/* MUI Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select Courier & Confirm</DialogTitle>
        <DialogContent dividers>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-medium mb-1" htmlFor="courier">
                Courier:
              </label>
              <select
                id="courier"
                value="steadfast"
                disabled
                className="w-full px-3 py-2  rounded bg-gray-100"
              >
                <option value="steadfast">Steadfast</option>
              </select>
            </div>

            <div className="bg-white shadow rounded p-6 space-y-2">
              <h1 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                Order Information
              </h1>
              <p className="text-gray-700">
                <span className="font-medium">Invoice:</span>{" "}
                {orderData.invoice}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Recipient Name:</span>{" "}
                {orderData.recipient_name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Recipient Phone:</span>{" "}
                {orderData.recipient_phone}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Recipient Address:</span>{" "}
                {orderData.recipient_address}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">COD Amount:</span> Tk{" "}
                {orderData.cod_amount}
              </p>
            </div>

            <div>
              <label className="block font-medium mb-1" htmlFor="note">
                Order Note:
              </label>
              <textarea
                id="note"
                rows="3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 rounded"
              ></textarea>
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <button
            className="px-4 py-2 bg-gray-300 cursor-pointer rounded hover:bg-gray-400"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2  rounded primaryBgColor accentTextColor  cursor-pointer flex items-center gap-2"
            onClick={handleSend}
            disabled={loading}
          >
            {loading && (
              <span className="w-4 h-4 cursor-pointer border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            Send
          </button>
        </DialogActions>
      </Dialog>

      {/* MUI Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          <span style={{ whiteSpace: "pre-line" }}>{snackbar.message}</span>
        </Alert>
      </Snackbar>
    </>
  );
};

export default SendToCourierButton;
