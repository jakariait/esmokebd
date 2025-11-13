import React, {useEffect} from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import OrdersPieChart from "../component/componentAdmin/OrdersPieChart.jsx";
import DailyOrdersChart from "../component/componentAdmin/DailyOrdersChart.jsx";
import MostSoldProductsChart from "../component/componentAdmin/MostSoldProductsChart.jsx";
import MonthlyRevenueChart from "../component/componentAdmin/MonthlyRevenueChart.jsx";
import MonthlyOrderStatusRatioChart from "../component/componentAdmin/MonthlyOrderStatusRatioChart.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

import useOrderStore from "../store/useOrderStore.js";

const DashboardPage = ({ pageDetails, title }) => {


  const { fetchAllOrders } = useOrderStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([

          fetchAllOrders(),
          fetchAllOrders("pending"),
          fetchAllOrders("approved"),
          fetchAllOrders("intransit"),
          fetchAllOrders("delivered"),
          fetchAllOrders("returned"),
          fetchAllOrders("cancelled"),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // ✅ Empty dependency array to prevent unnecessary re-renders





  return (
    <LayoutAdmin>
      <div>
        <Breadcrumb title={"Dashboard"} pageDetails={"WEBSITE CONFIG"} />

        <RequirePermission permission="dashboard">
          <div className={"flex flex-col gap-8"}>
            <div className={"grid md:grid-cols-2 gap-4"}>
              <OrdersPieChart />
              <MostSoldProductsChart />
            </div>
            <DailyOrdersChart />
            <MonthlyRevenueChart />
            <MonthlyOrderStatusRatioChart />
          </div>
        </RequirePermission>
      </div>
    </LayoutAdmin>
  );
};

export default DashboardPage;
