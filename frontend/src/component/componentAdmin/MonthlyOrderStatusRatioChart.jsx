import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Typography } from "@mui/material";
import useOrderStore from "../../store/useOrderStore";
import dayjs from "dayjs";

const MonthlyOrderStatusGroupedChart = () => {
  const { fetchAllOrdersWithoutPagination, allOrders } = useOrderStore();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchAllOrdersWithoutPagination();
  }, [fetchAllOrdersWithoutPagination]);

  useEffect(() => {
    if (allOrders.length === 0) return;

    const now = dayjs();
    const monthlyData = {};

    // Prepare 12 months structure
    for (let i = 11; i >= 0; i--) {
      const key = now.subtract(i, "month").format("YYYY-MM");
      monthlyData[key] = {
        month: dayjs(key).format("MMM YY"),
        Success: 0,
        Failed: 0,
        Returned: 0,
      };
    }

    allOrders.forEach((order) => {
      const key = dayjs(order.createdAt).format("YYYY-MM");
      if (!monthlyData[key]) return;

      const status = order.orderStatus?.toLowerCase();
      if (["delivered"].includes(status)) {
        monthlyData[key].Success += 1;
      } else if (status === "cancelled") {
        monthlyData[key].Failed += 1;
      } else if (status === "returned") {
        monthlyData[key].Returned += 1;
      }
    });

    setChartData(Object.values(monthlyData));
  }, [allOrders]);

  return (
    <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
      <Typography variant="h6" align="center" gutterBottom>
        Monthly Order Status (Last 12 Months)
      </Typography>
      <div className="h-[300px]">
        <ResponsiveBar
          data={chartData}
          keys={["Success", "Failed", "Returned"]}
          indexBy="month"
          groupMode="grouped"
          margin={{ top: 30, right: 80, bottom: 60, left: 50 }}
          padding={0.3}
          colors={({ id }) =>
            id === "Success"
              ? "#4caf50"
              : id === "Failed"
                ? "#f44336"
                : "#ff9800"
          }

          axisLeft={{
            legend: "Number of Orders",
            legendPosition: "middle",
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="#fff"
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom",
              direction: "row",
              translateY: 50,
              itemWidth: 80,
              itemHeight: 20,
              itemDirection: "left-to-right",
              symbolSize: 12,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default MonthlyOrderStatusGroupedChart;
