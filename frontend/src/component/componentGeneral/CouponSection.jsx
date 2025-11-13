import React, { useState } from "react";
import axios from "axios";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Add, Remove, CheckCircle, ErrorOutline } from "@mui/icons-material";

const CouponSection = ({
  orderAmount,
  setAppliedCouponGlobal, // To send coupon back to parent
}) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();

    if (!coupon.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/applyCoupon`, {
        code: coupon,
        orderAmount,
      });

      if (res.data.success) {
        const couponData = res.data.data;

        // Check if the orderAmount is below the minimumOrder
        if (orderAmount < couponData.minimumOrder) {
          setCouponError(
            `Minimum order amount should be ৳${couponData.minimumOrder}.`
          );
          setAppliedCoupon(null);
          setAppliedCouponGlobal(null);
          return;
        }

        // Date validation for coupon usage
        const now = new Date();
        const startDate = new Date(couponData.startDate);
        const endDate = new Date(couponData.endDate);

        if (now < startDate || now > endDate) {
          setCouponError("This coupon is not valid at this time.");
          setAppliedCoupon(null);
          setAppliedCouponGlobal(null);
          return;
        }

        const discountAmount =
          couponData.type === "percentage"
            ? (orderAmount * couponData.value) / 100
            : couponData.value;

        const finalCoupon = { ...couponData, discountAmount };

        setAppliedCoupon(finalCoupon);
        setAppliedCouponGlobal(finalCoupon);
        setCouponError("");
      } else {
        // If the API returns a failure (e.g., minimum order error)
        setCouponError(res.data.message || "Invalid coupon.");
        setAppliedCoupon(null);
        setAppliedCouponGlobal(null);
      }
    } catch (err) {
      // Capture any unexpected errors
      setCouponError(err.response?.data?.message || "Failed to apply coupon. Please try again.");
      setAppliedCoupon(null);
      setAppliedCouponGlobal(null);
      console.error(err);
    }
  };


  return (
    <div className="rounded-md shadow overflow-hidden bg-white">
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary expandIcon={expanded ? <Remove /> : <Add />}>
          <h1 className="border-l-4 primaryBorderColor primaryTextColor pl-2">
            Have a coupon or gift voucher?
          </h1>
        </AccordionSummary>

        <AccordionDetails>
          <div className="flex flex-col items-center space-x-3">
            <div className={"flex gap-2 accentBgColor w-full p-3 rounded-md"}>
              <input
                type="text"
                placeholder="Enter your coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-grow outline-none px-2 py-2 md:px-4 md:py-2 rounded-md bg-white"
              />
              <button
                onClick={handleApplyCoupon}
                className="primaryBgColor accentTextColor px-2 py-2 md:px-6 md:py-2 rounded-md cursor-pointer shadow-md"
              >
                Apply Coupon
              </button>
            </div>

            {/* Applied coupon success message */}
            {appliedCoupon && (
              <div className="flex items-center space-x-2 bg-green-100 w-full p-3 rounded-md mt-3">
                <CheckCircle sx={{ color: "#5cb85c" }} />
                <span className="text-green-600 text-sm">
                  Coupon <strong>{appliedCoupon.code}</strong> applied! You
                  saved{" "}
                  {appliedCoupon.type === "percentage"
                    ? `${appliedCoupon.value}%`
                    : `Tk.${appliedCoupon.value}`}
                  .
                </span>
              </div>
            )}

            {/* Error message */}
            {couponError && (
              <div className="flex items-center space-x-2 bg-red-100 w-full p-3 rounded-md mt-3">
                <ErrorOutline sx={{ color: "#d9534f" }} />
                <span className="text-red-500 text-sm">{couponError}</span>
              </div>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default CouponSection;
