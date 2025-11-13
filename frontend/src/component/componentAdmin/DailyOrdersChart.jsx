import React, { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import useOrderStore from "../../store/useOrderStore";
import dayjs from "dayjs";

const DailyOrdersChart = () => {
  const { fetchAllOrdersWithoutPagination, allOrders } = useOrderStore();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchAllOrdersWithoutPagination();
  }, [fetchAllOrdersWithoutPagination]);

  useEffect(() => {
    if (allOrders.length > 0) {
      const today = dayjs();
      const past30Days = Array.from({ length: 30 }, (_, i) =>
        today.subtract(i, "day").format("YYYY-MM-DD"),
      ).reverse();

      const orderCountMap = past30Days.reduce((acc, date) => {
        acc[date] = 0;
        return acc;
      }, {});

      allOrders.forEach((order) => {
        const orderDate = dayjs(order.orderDate).format("YYYY-MM-DD");
        if (orderCountMap[orderDate] !== undefined) {
          orderCountMap[orderDate]++;
        }
      });

      const formattedData = [
        {
          id: "Orders",
          data: Object.entries(orderCountMap).map(([date, count]) => ({
            x: dayjs(date).format("MM/DD"),
            y: count,
          })),
        },
      ];

      setChartData(formattedData);
    }
  }, [allOrders]);

  return (
    <Paper className="p-4 rounded-lg shadow">
      <Typography variant="h6" align="center" gutterBottom>
        Daily Orders (Last 30 Days)
      </Typography>
      <div style={{ height: 200 }}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 20, right: 80, bottom: 60, left: 50 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: 0, max: "auto" }}
          axisBottom={{
            tickRotation: -45,
            legend: "Date",
            legendOffset: 40,
            legendPosition: "middle",
          }}
          axisLeft={{
            legend: "Orders",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          colors={{ scheme: "category10" }}
          pointSize={8}
          pointBorderWidth={2}
          pointColor={{ theme: "background" }}
          pointBorderColor={{ from: "serieColor" }}
          useMesh={true}
          tooltip={({ point }) => (
            <div
              style={{
                background: "#fff",
                padding: "8px 12px",
                border: "1px solid #ccc",
              }}
            >
              <strong>{point.data.xFormatted}</strong>: {point.data.yFormatted}{" "}
              orders
            </div>
          )}
        />
      </div>
    </Paper>
  );
};

export default DailyOrdersChart;
