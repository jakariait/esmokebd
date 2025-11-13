import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import useAuthUserStore from "../../store/AuthUserStore";
import {
  Paper,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
} from "@mui/material";

const OrderDetailsByNo = () => {
  const { orderNo } = useParams(); // Get orderNo from URL
  const { token } = useAuthUserStore();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { color: "orange", text: "Pending" };
      case "intransit":
        return { color: "blue", text: "In Transit" };
      case "approved":
        return { color: "teal", text: "Approved" };
      case "delivered":
        return { color: "green", text: "Delivered" };
      case "cancelled":
        return { color: "red", text: "Cancelled" };
      case "returned":
        return { color: "purple", text: "Returned" };
      default:
        return { color: "gray", text: "Unknown" };
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "unpaid":
        return { backgroundColor: "#fff3cd", color: "#856404", text: "Unpaid" };
      case "paid":
        return { backgroundColor: "#d4edda", color: "#155724", text: "Paid" };
      default:
        return { backgroundColor: "lightgray", color: "gray", text: "Unknown" };
    }
  };

  const getPaymentMethodText = (paymentMethod) => {
    switch (paymentMethod) {
      case "cash_on_delivery":
        return "Cash on Delivery";
      case "bkash":
        return "bKash";
      case "nagad":
        return "Nagad";
      case "card":
        return "Card";
      default:
        return "Unknown Method";
    }
  };

  const getDeliveryMethodText = (deliveryMethod) => {
    switch (deliveryMethod) {
      case "home_delivery":
        return "Home Delivery";
      default:
        return "Unknown Method";
    }
  };

  const fetchOrderByOrderNo = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/order-no/${orderNo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setOrder(res.data.order);
      } else {
        setOrder(null);
      }
    } catch (err) {
      console.error("Error fetching order by orderNo:", err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderByOrderNo();
  }, [orderNo]);

  if (loading) return <CircularProgress />;
  if (!order) return <Typography>Order not found</Typography>;

  const orderStatusColor = getStatusColor(order.orderStatus);
  const paymentStatusColor = getPaymentStatusColor(order.paymentStatus);

  return (
    <div className="p-4 shadow rounded-lg mt-4">
      <div className="flex justify-between flex-wrap gap-6">
        {/* Shipping Info Section */}
        <div>
          <h2 className="font-bold text-xl mb-2">Shipping Info:</h2>
          <div className="flex flex-col gap-0.5">
            <p>{order.shippingInfo?.fullName}</p>
            <p>{order.shippingInfo?.mobileNo}</p>
            <p>{order.shippingInfo?.email}</p>
            <p>{order.shippingInfo?.address}</p>
          </div>
        </div>

        {/* Order Details Section */}
        <div>
          <div className="flex flex-col gap-0.5">
            <p>
              <strong>Order No:</strong> {order.orderNo}
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{ color: orderStatusColor.color, fontWeight: "bold" }}
              >
                {orderStatusColor.text}
              </span>
            </p>
            <p>
              <strong>Payment Method:</strong>{" "}
              {getPaymentMethodText(order.paymentMethod)}
            </p>
            <p>
              <strong>Payment Status:</strong>{" "}
              <span
                style={{
                  backgroundColor: paymentStatusColor.backgroundColor,
                  color: paymentStatusColor.color,
                  padding: "5px",
                  borderRadius: "5px",
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                }}
              >
                {paymentStatusColor.text}
              </span>
            </p>

            <p>
              <strong>Delivery Method:</strong>{" "}
              {getDeliveryMethodText(order.deliveryMethod)}
            </p>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="mt-6">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SL</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Variant</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Cost</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(order.items || []).map((item, index) => {
                const product = item.productId || {};
                const variant = product?.variants?.[0];
                const totalPrice = (item.price || 0) * (item.quantity || 0);

                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <div>{product.name || item.productName || "N/A"}</div>
                        <div>Category: {product?.category?.name || "N/A"}</div>
                        <div>Code: {product.productCode || "N/A"}</div>
                      </div>
                    </TableCell>
                    <TableCell>{variant ? variant.sizeName : "N/A"}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{(item.price ?? 0).toFixed(2)}</TableCell>
                    <TableCell>{totalPrice.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="mt-6 p-1 flex justify-between flex-wrap gap-6">
        <div>
          <h1 className="font-semibold mb-1">Billing Address:</h1>
          <div>
            <p>{order.shippingInfo?.fullName}</p>
            <p>{order.shippingInfo?.address}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 items-end">
          <p>Sub-total: Tk. {(order.subtotalAmount ?? 0).toFixed(2)}</p>
          <p>Promo Discount: Tk. {(order.promoDiscount ?? 0).toFixed(2)}</p>
          <p>Reward Points Used: {order.rewardPointsUsed || 0}</p>
          <p>VAT/TAX: Tk. {(order.vat ?? 0).toFixed(2)}</p>
          <p>Delivery Charge: Tk. {(order.deliveryCharge ?? 0).toFixed(2)}</p>
          <p>
            Special Discount Amount: Tk.{" "}
            {(order.specialDiscount ?? 0).toFixed(2)}
          </p>
          <p className="text-2xl font-bold">
            Total Order Amount: Tk. {(order.totalAmount ?? 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsByNo;
