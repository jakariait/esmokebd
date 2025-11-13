import React from "react";
import UserLayout from "../component/componentGeneral/UserLayout.jsx";
import UserStats from "../component/componentGeneral/UserStats.jsx";
import RecentOrders from "../component/componentGeneral/RecentOrders.jsx";

const UserHomePage = () => {
  return (
    <UserLayout>
      <UserStats />
      <RecentOrders/>
    </UserLayout>
  );
};

export default UserHomePage;
