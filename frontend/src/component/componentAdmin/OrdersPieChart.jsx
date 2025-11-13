import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import useOrderStore from "../../store/useOrderStore.js";
import { Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import dayjs from "dayjs";

const statusLabels = {
  pending: "Pending",
  approved: "Approved",
  intransit: "In Transit",
  delivered: "Delivered",
  returned: "Returned",
  cancelled: "Cancelled",
};

const OrdersPieChart = () => {
  const { fetchAllOrdersWithoutPagination, allOrders } = useOrderStore();
  const [timeframe, setTimeframe] = useState("monthly");
  const [statusCounts, setStatusCounts] = useState({});

  useEffect(() => {
    fetchAllOrdersWithoutPagination(); // fetch once on mount
  }, [fetchAllOrdersWithoutPagination]);

  useEffect(() => {
    const now = dayjs();
    let filteredOrders = [];

    if (timeframe === "weekly") {
      filteredOrders = allOrders.filter((order) =>
        dayjs(order.createdAt).isAfter(now.subtract(7, "day"))
      );
    } else if (timeframe === "monthly") {
      filteredOrders = allOrders.filter((order) =>
        dayjs(order.createdAt).isAfter(now.startOf("month"))
      );
    } else if (timeframe === "yearly") {
      filteredOrders = allOrders.filter((order) =>
        dayjs(order.createdAt).isAfter(now.startOf("year"))
      );
    } else if (timeframe === "lifetime") {
      filteredOrders = allOrders; // no filter
    }

    const counts = {};
    filteredOrders.forEach((order) => {
      const status = order.orderStatus || "unknown";
      if (!counts[status]) counts[status] = 0;
      counts[status]++;
    });

    setStatusCounts(counts);
  }, [allOrders, timeframe]);

  const pieData = Object.entries(statusCounts)
    .filter(([_, value]) => value > 0)
    .map(([key, value], index) => ({
      id: statusLabels[key] || key,
      label: statusLabels[key] || key,
      value,
    }));

  const totalOrders = pieData.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="bg-white rounded-lg shadow py-6 px-4">
      <div className="text-center mb-6">
        <Typography variant="h6">Order Status Breakdown</Typography>
        <p className="text-gray-500 font-medium">Total Orders: {totalOrders}</p>

        <ToggleButtonGroup
          color="primary"
          value={timeframe}
          exclusive
          onChange={(e, value) => value && setTimeframe(value)}
          size="small"
        >
          <ToggleButton value="weekly">Weekly</ToggleButton>
          <ToggleButton value="monthly">Monthly</ToggleButton>
          <ToggleButton value="yearly">Yearly</ToggleButton>
          <ToggleButton value="lifetime">Lifetime</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="relative h-[300px] w-full">
        <ResponsivePie
          data={pieData}
          margin={{ top: 10, right: 40, bottom: 10, left: 40 }}
          innerRadius={0.5}
          padAngle={1.5}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ scheme: "category10" }}
          enableArcLabels={false}
          enableArcLinkLabels={false}
        />
      </div>
    </div>
  );
};

export default OrdersPieChart;
