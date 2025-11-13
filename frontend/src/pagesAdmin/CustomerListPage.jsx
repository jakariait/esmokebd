import React from "react";
import CustomerList from "../component/componentAdmin/CustomerList.jsx";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const CustomerListPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="CUSTOMERS" title="View All Customers" />

      <RequirePermission permission="view_customers">
        <CustomerList />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default CustomerListPage;
