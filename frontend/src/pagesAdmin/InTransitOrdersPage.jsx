import React, { useEffect } from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AllOrders from "../component/componentAdmin/AllOrders.jsx";
import useOrderStore from "../store/useOrderStore.js";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const InTransitOrdersPage = () => {
  const {
    orderListByStatus,
    orderListLoading,
    orderListError,
    fetchAllOrders,
    currentPage,
    itemsPerPage,
  } = useOrderStore();

  useEffect(() => {
    fetchAllOrders("intransit", currentPage, itemsPerPage);
  }, [fetchAllOrders, currentPage, itemsPerPage]);

  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="ORDERS" title="View All In Transit Orders" />
      <RequirePermission permission="view_orders">
        <AllOrders
          allOrders={orderListByStatus.intransit}
          orderListLoading={orderListLoading}
          orderListError={orderListError}
          title={"In Transit Orders"}
        />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default InTransitOrdersPage;
