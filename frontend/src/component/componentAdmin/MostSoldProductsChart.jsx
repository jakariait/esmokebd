import React, { useEffect, useState } from "react";
import { Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import useOrderStore from "../../store/useOrderStore.js";
import dayjs from "dayjs";

const MostSoldProductsPieChart = () => {
  const { fetchAllOrdersWithoutPagination, allOrders } = useOrderStore();
  const [productSales, setProductSales] = useState([]);
  const [totalSold, setTotalSold] = useState(0);
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [timeframe, setTimeframe] = useState("monthly");

  useEffect(() => {
    fetchAllOrdersWithoutPagination();
  }, [fetchAllOrdersWithoutPagination]);

  useEffect(() => {
    if (allOrders.length > 0) {
      const now = dayjs();
      let filteredOrders = [];

      if (timeframe === "weekly") {
        filteredOrders = allOrders.filter((order) =>
          dayjs(order.createdAt).isAfter(now.subtract(7, "day")),
        );
      } else if (timeframe === "monthly") {
        filteredOrders = allOrders.filter((order) =>
          dayjs(order.createdAt).isAfter(now.startOf("month")),
        );
      } else if (timeframe === "yearly") {
        filteredOrders = allOrders.filter((order) =>
          dayjs(order.createdAt).isAfter(now.startOf("year")),
        );
      } else {
        // lifetime - no filtering
        filteredOrders = allOrders;
      }

      const productCountMap = {};
      let total = 0;

      filteredOrders
        .filter((order) => order.orderStatus !== "cancelled")
        .forEach((order) => {
          order.items?.forEach((item) => {
            const name = item.productId?.name || "Unknown Product";
            const qty = item.quantity || 1;

            if (!productCountMap[name]) productCountMap[name] = 0;
            productCountMap[name] += qty;
            total += qty;
          });
        });

      const pieData = Object.entries(productCountMap)
        .map(([id, value]) => ({
          id,
          label: id,
          value,
        }))
        .sort((a, b) => b.value - a.value);

      setProductSales(pieData);
      setTotalSold(total);
    }
  }, [allOrders, timeframe]);

  return (
    <div className="relative bg-white rounded-lg shadow py-6 px-4 overflow-hidden">
      <div className="text-center mb-6">
        <Typography variant="h6">Best Selling Products</Typography>
        <p className="text-gray-500 font-medium">
          Total Items Sold: {totalSold}
        </p>

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
          data={productSales}
          margin={{ top: 10, right: 40, bottom: 10, left: 40 }}
          innerRadius={0.5}
          padAngle={1.5}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ scheme: "category10" }}
          enableArcLabels={false}
          enableArcLinkLabels={false}
          onMouseEnter={(data) => setHoveredSlice(data)}
          onMouseLeave={() => setHoveredSlice(null)}
        />
      </div>
    </div>
  );
};

export default MostSoldProductsPieChart;
