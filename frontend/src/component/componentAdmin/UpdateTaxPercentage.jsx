import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthAdminStore from "../../store/AuthAdminStore";

const UpdateFreeDeliveryAmount = () => {
  const [amount, setAmount] = useState("");
  const [currentValue, setCurrentValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const { token } = useAuthAdminStore();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCurrentValue = async () => {
      try {
        const res = await axios.get(`${apiUrl}/getVatPercentage`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentValue(res.data?.data?.value ?? 0);
      } catch (err) {
        console.error("Failed to fetch current value", err);
      } finally {
        setFetching(false);
      }
    };
    fetchCurrentValue();
  }, [apiUrl, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount.trim()) return alert("Please enter a valid Percentage");
    try {
      setLoading(true);
      await axios.patch(
        `${apiUrl}/updateVatPercentage`,
        { value: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCurrentValue(Number(amount));
      setAmount("");
      setSnackbar({
        open: true,
        message: "Tax/VAT Percentage amount updated successfully",
        type: "success",
      });
    } catch (err) {
      console.error("Update failed", err);
      setSnackbar({
        open: true,
        message: "Something went wrong while updating",
        type: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setSnackbar((prev) => ({ ...prev, open: false })), 3000);
    }
  };

  return (
    <>
      <div className=" bg-white shadow-md rounded-xl p-4">
        <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-4 pl-2 text-lg font-semibold">
          Tax/VAT Percentage Settings
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-sm text-gray-700">
            Current Tax/VAT Percentage:{" "}
            <span className="font-semibold primaryTextColor">
              {fetching ? "Loading..." : `${currentValue}%`}
            </span>
            <p>Set 0 to deactivate Tax/VAT</p>
          </p>
          <div className="flex flex-col space-y-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 10"
              className=" px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 cursor-pointer rounded-md primaryBgColor accentTextColor`}
            >
              {loading ? "Updating..." : "Update Percentage"}
            </button>
          </div>
        </form>
      </div>
      {snackbar.open && (
        <div
          className={`fixed top-5 right-5 px-4 py-3 rounded-md shadow-md text-white transition-all duration-300 ${snackbar.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {snackbar.message}
        </div>
      )}
    </>
  );
};

export default UpdateFreeDeliveryAmount;
