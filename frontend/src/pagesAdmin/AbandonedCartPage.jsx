import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AbandonedCartsContainer from "../component/componentAdmin/AbandonedCartsContainer.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const AbandonedCartPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb
        pageDetails="INCOMPLETE ORDER"
        title="View All Incomplete Orders"
      />
      <RequirePermission permission="incomplete_orders">
        <AbandonedCartsContainer />
      </RequirePermission >

    </LayoutAdmin>
  );
};

export default AbandonedCartPage;
