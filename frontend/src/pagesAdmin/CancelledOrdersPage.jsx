import React, { useEffect } from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AllOrders from "../component/componentAdmin/AllOrders.jsx";
import useOrderStore from "../store/useOrderStore.js";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const CancelledOrdersPage = () => {
  const {
    orderListByStatus,
    orderListLoading,
    orderListError,
    fetchAllOrders,
    currentPage,
    itemsPerPage,
  } = useOrderStore();

  useEffect(() => {
    fetchAllOrders("cancelled", currentPage, itemsPerPage);
  }, [fetchAllOrders, currentPage, itemsPerPage]);

  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="ORDERS" title="View All Cancelled Orders" />
      <RequirePermission permission="view_orders">
        <AllOrders
          allOrders={orderListByStatus.cancelled}
          orderListLoading={orderListLoading}
          orderListError={orderListError}
          title={"Cancelled Orders"}
        />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default CancelledOrdersPage;
