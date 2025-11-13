import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthUserStore from "../../store/AuthUserStore.js";
import axios from "axios";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Typography,
  Paper,
  TableContainer,
} from "@mui/material";

const RecentOrders = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { user, token } = useAuthUserStore();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

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
          const sortedOrders = response.data.orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);

          setOrders(sortedOrders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [user?._id]);

  const handleViewMore = (orderId) => {
    navigate(`/user/orders/${orderId}`);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <div
        className={
          "flex justify-between items-center mb-2 primaryBgColor accentTextColor p-4 "
        }
      >
        <p>Recent Orders</p>
        <button className={"cursor-pointer"}>View More</button>
      </div>

      {orders.length === 0 ? (
        <Typography>No recent orders found.</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>Order No</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Total Amount</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((order) => {
                const totalQuantity = order.items
                  ? order.items.reduce((sum, item) => sum + item.quantity, 0)
                  : 0;
                const orderDate = new Date(
                  order.createdAt,
                ).toLocaleDateString();

                return (
                  <TableRow key={order._id} hover>
                    <TableCell>{order.orderNo}</TableCell>
                    <TableCell>{orderDate}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {order.orderStatus}
                    </TableCell>
                    <TableCell align="right">{totalQuantity}</TableCell>
                    <TableCell align="right">
                      Tk. {order.totalAmount?.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleViewMore(order.orderNo)}
                      >
                        View More
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default RecentOrders;
