import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import useOrderStore from "../../store/useOrderStore";
import dayjs from "dayjs";

const MonthlyRevenueChart = () => {
  const { fetchAllOrdersWithoutPagination, allOrders } = useOrderStore();
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    fetchAllOrdersWithoutPagination();
  }, [fetchAllOrdersWithoutPagination]);

  useEffect(() => {
    if (allOrders.length === 0) return;

    const now = dayjs();
    const revenueMap = {};

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const monthKey = now.subtract(i, "month").format("YYYY-MM");
      revenueMap[monthKey] = 0;
    }

    allOrders
      .filter((order) => order.orderStatus === "delivered")
      .forEach((order) => {
        const monthKey = dayjs(order.createdAt).format("YYYY-MM");
        if (revenueMap[monthKey] !== undefined) {
          revenueMap[monthKey] += Number(order.totalAmount || 0);
        }
      });

    const chartData = [
      {
        id: "Revenue",
        data: Object.entries(revenueMap).map(([month, value]) => ({
          x: dayjs(month).format("MMM YYYY"), // e.g., Jan 2025
          y: parseFloat(value.toFixed(2)), // round to 2 decimals
        })),
      },
    ];

    setMonthlyRevenue(chartData);
  }, [allOrders]);

  return (
    <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
      <Typography variant="h6" align="center" gutterBottom>
        Monthly Revenue (Last 12 Months)
      </Typography>
      <div className="h-[200px]">
        <ResponsiveLine
          data={monthlyRevenue}
          margin={{ top: 20, right: 80, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: 0, max: "auto", stacked: false }}
          axisLeft={{
            orient: "left",
            legend: "Revenue (৳)",
            legendOffset: -50,
            legendPosition: "middle",
          }}
          colors={{ scheme: "category10" }}
          pointSize={8}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          useMesh={true}
        />
      </div>
    </div>
  );
};

export default MonthlyRevenueChart;
