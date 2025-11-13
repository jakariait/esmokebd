import React, { useEffect, useState } from "react";
import {
  FaShoppingBag,
  FaBox,
  FaShoppingCart,
  FaMoneyBillWave,
} from "react-icons/fa";
import useCartStore from "../../store/useCartStore.js";
import useAuthUserStore from "../../store/AuthUserStore.js";
import axios from "axios";

const UserStats = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { cart } = useCartStore();
  const { user, token } = useAuthUserStore();

  const [totalOrders, setTotalOrders] = useState(0);
  const [deliveredAmount, setDeliveredAmount] = useState(0);
  const [runningOrders, setRunningOrders] = useState(0);

  useEffect(() => {
    if (!user?._id) return;

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${apiUrl}/ordersbyUser/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          const orders = response.data.orders;

          setTotalOrders(response.data.totalOrders);

          // Delivered orders
          const deliveredOrders = orders.filter(
            (order) => order.orderStatus === "delivered",
          );

          // Running orders: orders not delivered, not returned, and not cancelled
          const runningOrders = orders.filter(
            (order) =>
              !["delivered", "returned", "cancelled"].includes(
                order.orderStatus,
              ),
          );

          // Sum total amounts of delivered orders
          const totalDeliveredAmount = deliveredOrders.reduce((sum, order) => {
            return sum + (order.totalAmount || 0);
          }, 0);
          const formattedAmount = totalDeliveredAmount.toFixed(2); // returns string "7087.80"

          setDeliveredAmount(formattedAmount);
          setRunningOrders(runningOrders.length); // You'll need a new state for runningOrders
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [user?._id]);

  const statsData = [
    {
      value: totalOrders,
      label: "Total order placed",
      icon: <FaShoppingBag className="text-3xl text-blue-500" />,
    },
    {
      value: runningOrders,
      label: "Running orders",
      icon: <FaBox className="text-3xl text-yellow-500" />,
    },
    {
      value: cart?.reduce((total, item) => total + item.quantity, 0) || 0,
      label: "Items in cart",
      icon: <FaShoppingCart className="text-3xl text-green-500" />,
    },
    {
      value: deliveredAmount,
      label: "Amount spent on delivered orders",
      icon: <FaMoneyBillWave className="text-3xl text-blue-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-1  lg:grid-cols-2 gap-3 md:gap-5 p-2 py-5">
      {statsData.map((item, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-white via-[#f4f4f9] to-white p-5 rounded-2xl shadow-sm flex justify-between items-center transition-all duration-200"
        >
          <div>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-sm text-gray-600">{item.label}</p>
          </div>
          <div className="bg-white rounded-full p-3 shadow">{item.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default UserStats;
