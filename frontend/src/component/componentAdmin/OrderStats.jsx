import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Card, CardContent, Typography, Stack } from "@mui/material";

import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ReplayIcon from "@mui/icons-material/Replay";
import CancelIcon from "@mui/icons-material/Cancel";
import useAuthAdminStore from "../../store/AuthAdminStore.js";

const statusIcons = {
  pending: <HourglassEmptyIcon color="warning" fontSize="large" />,
  approved: <TaskAltIcon color="info" fontSize="large" />,
  intransit: <LocalShippingIcon color="primary" fontSize="large" />,
  delivered: <DoneAllIcon color="success" fontSize="large" />,
  returned: <ReplayIcon color="secondary" fontSize="large" />,
  cancelled: <CancelIcon color="error" fontSize="large" />,
};

const OrderStats = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuthAdminStore();
  const [amountByStatus, setAmountByStatus] = useState({
    pending: 0,
    approved: 0,
    intransit: 0,
    delivered: 0,
    returned: 0,
    cancelled: 0,
  });

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${apiUrl}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const orders = res.data?.orders || [];

      const totals = {
        pending: 0,
        approved: 0,
        intransit: 0,
        delivered: 0,
        returned: 0,
        cancelled: 0,
      };

      orders.forEach((order) => {
        const status = order.orderStatus?.toLowerCase();
        const amount = order.totalAmount || 0;

        if (totals.hasOwnProperty(status)) {
          totals[status] += amount;
        }
      });

      setAmountByStatus(totals);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: "repeat(2, 1fr)",
        sm: "repeat(3, 1fr)",
        lg: "repeat(6, 1fr)",
      }}
      gap={2}
      my={4}
    >
      {Object.entries(amountByStatus).map(([status, amount]) => (
        <Card key={status} elevation={1}>
          <CardContent sx={{ textAlign: "center" }}>
            <Stack spacing={1} alignItems="center">
              {statusIcons[status]}
              <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
                Total {status} Orders
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                Tk. {amount.toFixed(2)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default OrderStats;
