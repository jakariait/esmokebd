import React, { useEffect } from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AllOrders from "../component/componentAdmin/AllOrders.jsx";
import useOrderStore from "../store/useOrderStore.js";
import OrderStats from "../component/componentAdmin/OrderStats.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const AllOrdersPage = () => {
  const {
    allOrders,
    orderListLoading,
    orderListError,
    fetchAllOrders,
    currentPage,
    itemsPerPage,
  } = useOrderStore();

  useEffect(() => {
    fetchAllOrders("", currentPage, itemsPerPage);
  }, [fetchAllOrders, currentPage, itemsPerPage]);

  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="ORDERS" title="View All Orders" />
      {/* Order status totals */}
      <RequirePermission permission="view_orders">
        <OrderStats orders={allOrders} />
        <AllOrders
          allOrders={allOrders}
          orderListLoading={orderListLoading}
          orderListError={orderListError}
          title={"All Orders"}
        />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default AllOrdersPage;
