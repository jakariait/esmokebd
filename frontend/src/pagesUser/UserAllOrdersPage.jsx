import React from 'react';
import UserLayout from "../component/componentGeneral/UserLayout.jsx";
import AllOrders from "../component/componentGeneral/AllOrders.jsx";

const UserAllOrdersPage = () => {
  return (
    <UserLayout>
      <AllOrders/>
    </UserLayout>
  );
};

export default UserAllOrdersPage;