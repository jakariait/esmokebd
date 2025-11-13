import React from "react";
import UserLayout from "../component/componentGeneral/UserLayout.jsx";

import OrderDetailsByNo from "../component/componentGeneral/OrderDetailsByNo.jsx";

const UserOrderDetailsPage = () => {
  return (
    <UserLayout>
      <OrderDetailsByNo />
    </UserLayout>
  );
};

export default UserOrderDetailsPage;
