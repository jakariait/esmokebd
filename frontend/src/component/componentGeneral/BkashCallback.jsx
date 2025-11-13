// import { useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import useCartStore from "../../store/useCartStore";
//
// const BkashCallback = () => {
//   const navigate = useNavigate();
//   const { clearCart } = useCartStore();
//
//   useEffect(() => {
//     const executeBkash = async () => {
//       const urlParams = new URLSearchParams(window.location.search);
//       const paymentID = urlParams.get("paymentID");
//
//       if (!paymentID) return;
//
//       try {
//         const execRes = await axios.post(
//           `${import.meta.env.VITE_API_URL}/bkashexecute`,
//           { paymentID }
//         );
//
//         if (execRes.data && execRes.data.paymentID) {
//           const orderPayload = JSON.parse(localStorage.getItem("bkash_order_payload"));
//           if (!orderPayload) return;
//
//           orderPayload.paymentId = paymentID;
//
//           const orderRes = await axios.post(
//             `${import.meta.env.VITE_API_URL}/orders`,
//             orderPayload
//           );
//
//           if (orderRes.data.success) {
//             clearCart();
//             localStorage.removeItem("bkash_order_payload");
//             navigate(`/thank-you/${orderRes.data.order.orderNo}`);
//           }
//         }
//       } catch (err) {
//         console.error("bKash callback processing failed:", err);
//       }
//     };
//
//     executeBkash();
//   }, [clearCart, navigate]);
//
//   return null;
// };
//
// export default BkashCallback;


import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";

const BkashCallback = () => {
  const navigate = useNavigate();
  const { clearCart } = useCartStore();

  useEffect(() => {
    const executeBkash = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentID = urlParams.get("paymentID");
      const status = urlParams.get("status"); // Check for status

      if (status === "cancel" || status === "failure" || !paymentID) {
        // If the payment was canceled, failed, or there's no paymentID, redirect to home
        navigate("/");
        return;
      }

      try {
        const execRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/bkashexecute`,
          { paymentID }
        );

        if (execRes.data && execRes.data.paymentID) {
          const orderPayload = JSON.parse(localStorage.getItem("bkash_order_payload"));
          if (!orderPayload) return;

          orderPayload.paymentId = paymentID;
          orderPayload.paymentStatus = "paid";

          // Generate random tranxId
          orderPayload.transId = "BKASH-" + Math.random().toString(36).substr(2, 9).toUpperCase();


          // Set the advanceAmount from the amount field in the bKash response
          orderPayload.advanceAmount = Number(execRes.data.amount) || 0;


          const orderRes = await axios.post(
            `${import.meta.env.VITE_API_URL}/orders`,
            orderPayload
          );

          if (orderRes.data.success) {
            clearCart();
            localStorage.removeItem("bkash_order_payload");
            navigate(`/thank-you/${orderRes.data.order.orderNo}`);
          }
        }
      } catch (err) {
        console.error("bKash callback processing failed:", err);
      }
    };

    executeBkash();
  }, [clearCart, navigate]);

  return null;
};

export default BkashCallback;
