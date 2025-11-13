import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

// Stores
import useCartStore from "../../store/useCartStore.js";
import useAuthUserStore from "../../store/AuthUserStore.js";

// Custom Components
import AddressForm from "./AddressForm.jsx";
import ShippingOptions from "./ShippingOptions.jsx";
import OrderReview from "./OrderReview.jsx";
import CouponSection from "./CouponSection.jsx";
import RewardPoints from "./RewardPoints.jsx";
import DeliveryMethod from "./DeliveryMethod.jsx";
import OrderSummary from "./OrderSummary.jsx";
import CheckoutHeader from "./CheckoutHeader.jsx";
import PaymentMethod from "./PaymentMethod.jsx";
import AbandonedCartTracker from "./AbandonedCartTracker.jsx";

const Checkout = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Store values
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const { user } = useAuthUserStore();

  // Coupon & Reward
  const [rewardPointsUsed, setRewardPointsUsed] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Shipping state
  const [selectedShipping, setSelectedShipping] = useState({
    name: "",
    value: 0,
  });

  // Payment Method state
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");

  // Free Delivery
  const [freeDelivery, setFreeDelivery] = useState(null);

  // Vat Percentage
  const [vatPercentage, setVatPercentage] = useState(null);

  // Shipping Details Handler
  const [addressData, setAddressData] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // Handle data received from AddressForm
  const handleAddressChange = (data) => {
    setAddressData(data);
  };

  const handleRewardPointsChange = (value) => {
    setRewardPointsUsed(value);
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error"
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fetch free delivery threshold
  useEffect(() => {
    const fetchAmount = async () => {
      try {
        const res = await axios.get(`${apiUrl}/getFreeDeliveryAmount`);
        if (res.data?.success) {
          setFreeDelivery(res.data.data.value);
        }
      } catch (err) {
        console.error("Failed to fetch free delivery amount", err);
      }
    };

    fetchAmount();
  }, []);

  // Price Calculations
  const totalAmount = cart.reduce((total, item) => {
    const price =
      item.discountPrice > 0 ? item.discountPrice : item.originalPrice;
    return total + price * item.quantity;
  }, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formattedTotalAmount = (amount) => Number(amount).toLocaleString();

  const actualShippingCost =
    freeDelivery > 1 && totalAmount >= freeDelivery
      ? 0
      : selectedShipping.value;

  let discount = appliedCoupon?.discountAmount || 0;

  // Calculate total amount after reward points and coupon discount
  const amountAfterDiscounts = totalAmount - rewardPointsUsed - discount;

  // --- VAT Calculation (e.g., 5%) ---
  const vatAmount = (amountAfterDiscounts * vatPercentage) / 100;

  useEffect(() => {
    const fetchVatAmount = async () => {
      try {
        const res = await axios.get(`${apiUrl}/getVatPercentage`);
        if (res.data?.success) {
          setVatPercentage(res.data.data.value);
        }
      } catch (err) {
        console.error("Failed to fetch VAT Percentage", err);
      }
    };

    fetchVatAmount();
  }, []);

  // Data Layer for Initiat Checkout

  useEffect(() => {
    if (cart.length > 0) {
      window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          currency: "BDT",
          value: totalAmount,
          items: cart.map((item) => ({
            item_name: item.name,
            item_id: item.contentId,
            price:
              item.discountPrice > 0 ? item.discountPrice : item.originalPrice,
            quantity: item.quantity,
            item_variant: item.variantId || "Default",
          })),
        },
      });
    }
  }, [cart, totalAmount]);

  if (vatPercentage === null || freeDelivery === null) return null;

  // --- Grand Total ---
  const grandTotal = amountAfterDiscounts + vatAmount + actualShippingCost;

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setIsProcessingOrder(true); // Disable button immediately

    const orderPayload = {
      shippingInfo: {
        fullName: addressData.fullName,
        mobileNo: addressData.phone,
        email: addressData.email,
        address: addressData.address,
      },
      shippingId: selectedShipping.id,
      items: cart.map((item) => {
        const baseItem = {
          productId: item.productId,
          quantity: item.quantity,
        };
        if (item.variantId && item.variantId !== "Default") {
          baseItem.variantId = item.variantId;
        }
        return baseItem;
      }),
      promoCode: appliedCoupon?.code || null,
      paymentMethod,
    };

    if (user?._id) {
      orderPayload.userId = user._id;
    }

    // // ---- Handle bKash Checkout ----
    if (paymentMethod === "bkash") {
      try {
        const createRes = await axios.post(`${apiUrl}/bkashcreate`, {
          amount: grandTotal.toFixed(2), // round to 2 decimal places
          payerReference: user?.phone || "guestUser",
          callbackURL: `${window.location.origin}/bkash-callback`,
        });

        if (createRes.data && createRes.data.bkashURL) {
          localStorage.setItem(
            "bkash_order_payload",
            JSON.stringify(orderPayload),
          );
          window.location.href = createRes.data.bkashURL;
          return;
        } else {
          showSnackbar("Failed to initiate bKash payment", "error");
        }
      } catch (err) {
        console.error(err);
        showSnackbar("bKash payment initialization failed", "error");
      } finally {
        setIsProcessingOrder(false); // Re-enable button
      }
      return;
    }

    // ---- Normal COD Flow ----

    try {
      const res = await axios.post(`${apiUrl}/orders`, orderPayload);

      if (res.data.success) {
        setOrderPlaced(true);

        clearCart();
        showSnackbar("Order placed successfully!", "success");

        setTimeout(() => {
          navigate(`/thank-you/${res.data.order.orderNo}`);
        }, 300); // delay by 300ms
      } else {
        showSnackbar(res.data.message || "Failed to place order.", "error");
      }
    } catch {
      showSnackbar("Something went wrong. Please try again later.", "error");
    } finally {
      setIsProcessingOrder(false); // Re-enable button
    }
  };

  return (
    <div className="xl:container xl:mx-auto p-4">
      <CheckoutHeader user={user} />
      <form onSubmit={handleOrderSubmit}>
        <div className="grid gap-12 md:grid-cols-2">
          {/* Left Column - Address & Shipping */}
          <div className="space-y-8">
            {/* Address Option */}
            <AddressForm user={user} onAddressChange={handleAddressChange} />

            {/* Shipping Options */}
            <ShippingOptions onShippingChange={setSelectedShipping} />

            {/* Delivery Method */}
            <DeliveryMethod
              freeDelivery={freeDelivery}
              formattedTotalAmount={formattedTotalAmount}
            />
            {/* Payment Method */}
            <PaymentMethod
              selectedMethod={paymentMethod}
              setSelectedMethod={setPaymentMethod}
            />
          </div>

          {/* Right Column - Order Review */}
          <div className="space-y-8">
            <OrderReview
              cart={cart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              formattedTotalAmount={formattedTotalAmount}
            />

            {/* Coupon Section */}
            <CouponSection
              orderAmount={totalAmount}
              setAppliedCouponGlobal={setAppliedCoupon}
            />

            {/* Reward Points */}
            {user && (
              <RewardPoints
                availablePoints={user.rewardPoints}
                points={rewardPointsUsed}
                onPointsChange={handleRewardPointsChange}
              />
            )}

            {/* Final Order Summary */}
            <OrderSummary
              totalItems={totalItems}
              totalAmount={totalAmount}
              rewardPointsUsed={rewardPointsUsed}
              actualShippingCost={actualShippingCost}
              grandTotal={grandTotal}
              discount={discount}
              appliedCoupon={appliedCoupon}
              formattedTotalAmount={formattedTotalAmount}
              showRewardPoints={!!user}
              vatAmount={vatAmount}
              vatPercentage={vatPercentage}
            />
            <button
              className={
                "primaryBgColor accentTextColor px-4 py-2 w-full rounded-lg cursor-pointer"
              }
              disabled={isProcessingOrder}
            >
              {paymentMethod === "cash_on_delivery"
                ? "Place Order (Cash on Delivery)"
                : "Process to Payment (bKash)"}
            </button>
          </div>
        </div>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <AbandonedCartTracker
        addressData={addressData}
        cart={cart}
        totalAmount={grandTotal} // Use grandTotal here
        user={user}
        apiUrl={apiUrl}
        orderPlaced={orderPlaced} // Pass orderPlaced
      />
    </div>
  );
};

export default Checkout;
