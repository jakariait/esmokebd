import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthUserStore from "../../store/AuthUserStore.js";
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
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AllOrders = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { user, token } = useAuthUserStore();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const rowsPerPage = 10;
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!user?._id) return;
    setLoading(true);

    try {
      const url = `${apiUrl}/ordersbyUser/${user._id}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?._id, token]);

  const handleViewMore = (orderId) => {
    navigate(`/user/orders/${orderId}`);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  // Paginate locally
  const paginatedOrders = orders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Paper sx={{ p: 3 }}>
      <div className="flex justify-between items-center mb-2 primaryBgColor accentTextColor p-4">
        <p>All Orders</p>
      </div>

      {loading ? (
        <CircularProgress />
      ) : orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <>
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
                {paginatedOrders.map((order) => {
                  const totalQuantity = order.items?.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                  );
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

          <TablePagination
            component="div"
            count={orders.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
          />
        </>
      )}
    </Paper>
  );
};

export default AllOrders;
