import React, { useEffect } from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AllOrders from "../component/componentAdmin/AllOrders.jsx";
import useOrderStore from "../store/useOrderStore.js";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const ReturnedOrdersPage = () => {
  const {
    orderListByStatus,
    orderListLoading,
    orderListError,
    fetchAllOrders,
    currentPage,
    itemsPerPage,
  } = useOrderStore();

  useEffect(() => {
    fetchAllOrders("returned", currentPage, itemsPerPage);
  }, [fetchAllOrders, currentPage, itemsPerPage]);

  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="ORDERS" title="View All Returned Orders" />
      <RequirePermission permission="view_orders">
        <AllOrders
          allOrders={orderListByStatus.returned}
          orderListLoading={orderListLoading}
          orderListError={orderListError}
          title={"Returned Orders"}
        />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default ReturnedOrdersPage;
