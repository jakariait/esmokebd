import React, { useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";

const AbandonedCartTracker = ({
                                addressData,
                                cart,
                                totalAmount,
                                user,
                                apiUrl,
                                orderPlaced,
                              }) => {
  const location = useLocation();
  const latestProps = useRef();
  latestProps.current = { addressData, cart, totalAmount, user, apiUrl, orderPlaced };

  useEffect(() => {
    if (latestProps.current.orderPlaced) {
      sessionStorage.setItem("orderPlaced", "true");
      sessionStorage.removeItem("wasInCheckout");
      sessionStorage.removeItem("abandonedCartSent");
    }
  }, [orderPlaced]);

  const isOrderPlaced = useCallback(() => {
    const { orderPlaced } = latestProps.current;
    const storageValue = sessionStorage.getItem("orderPlaced") === "true";
    return orderPlaced || storageValue;
  }, []);

  const canSend = useCallback(() => {
    const { addressData, cart } = latestProps.current;
    const phoneValid = addressData?.phone?.length === 11;
    const cartValid = cart?.length > 0;
    const notSentBefore = !sessionStorage.getItem("abandonedCartSent");
    return phoneValid && cartValid && notSentBefore;
  }, []);

  const getPayload = useCallback(() => {
    const { addressData, cart, totalAmount, user, orderPlaced } = latestProps.current;
    return {
      userId: user?._id || undefined,
      fullName: addressData?.fullName || undefined,
      number: addressData?.phone,
      email: addressData?.email || undefined,
      address: addressData?.address || undefined,
      cartItems: cart.map((item) => {
        const variantId =
          item.variantId && item.variantId !== "Default"
            ? item.variantId
            : undefined;
        return {
          productId: item.productId,
          ...(variantId && { variantId }),
          price:
            item.discountPrice > 0 ? item.discountPrice : item.originalPrice,
          quantity: item.quantity,
        };
      }),
      totalAmount,
      orderPlaced: orderPlaced,
    };
  }, []);

  const sendAbandonedCart = useCallback(() => {
    if (!canSend() || isOrderPlaced()) {
      return false;
    }
    const payload = getPayload();
    const { apiUrl } = latestProps.current;
    try {
      const beaconSent = navigator.sendBeacon(
        `${apiUrl}/abandoned-cart`,
        new Blob([JSON.stringify(payload)], { type: "application/json" }),
      );
      if (beaconSent) {
        sessionStorage.setItem("abandonedCartSent", "true");
      }
      return beaconSent;
    } catch (error) {
      return false;
    }
  }, [canSend, getPayload, isOrderPlaced]);

  // Handles SPA navigation away from checkout
  useEffect(() => {
    if (location.pathname.includes("/checkout")) {
      // If a timer was set by a previous checkout page, cancel it.
      if (window.abandonedCartTimer) {
        clearTimeout(window.abandonedCartTimer);
      }
      sessionStorage.setItem("wasInCheckout", "true");
      sessionStorage.removeItem("abandonedCartSent");
    }

    return () => {
      // When component unmounts, set a timer to send the beacon.
      const wasInCheckout = sessionStorage.getItem("wasInCheckout") === "true";
      if (wasInCheckout) {
        window.abandonedCartTimer = setTimeout(() => {
          if (!isOrderPlaced()) {
            sendAbandonedCart();
          }
          sessionStorage.removeItem("wasInCheckout");
        }, 100);
      }
    };
  }, [location.pathname, isOrderPlaced, sendAbandonedCart]);

  // Handles closing tab or navigating to a different site
  useEffect(() => {
    const handlePotentialUnload = (event) => {
      if (event.type === 'visibilitychange' && document.visibilityState !== 'hidden') {
        return;
      }

      const wasInCheckout = sessionStorage.getItem("wasInCheckout") === "true";
      if (wasInCheckout && !isOrderPlaced()) {
        sendAbandonedCart();
      }
    };

    window.addEventListener("visibilitychange", handlePotentialUnload);
    window.addEventListener("pagehide", handlePotentialUnload);

    return () => {
      window.removeEventListener("visibilitychange", handlePotentialUnload);
      window.removeEventListener("pagehide", handlePotentialUnload);
    };
  }, [isOrderPlaced, sendAbandonedCart]);

  return null;
};

export default AbandonedCartTracker;
