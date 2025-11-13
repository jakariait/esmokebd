import React, { useEffect } from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AllOrders from "../component/componentAdmin/AllOrders.jsx";
import useOrderStore from "../store/useOrderStore.js";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const PendingOrdersPage = () => {
	const {
		orderListByStatus,
		orderListLoading,
		orderListError,
		fetchAllOrders,
		currentPage,
		itemsPerPage,
	} = useOrderStore();

	useEffect(() => {
		fetchAllOrders("pending", currentPage, itemsPerPage);
	}, [fetchAllOrders, currentPage, itemsPerPage]);

	return (
		<LayoutAdmin>
			<Breadcrumb pageDetails="ORDERS" title="View All Pending Orders" />
			<RequirePermission permission="view_orders">

			<AllOrders
				allOrders={orderListByStatus.pending}
				orderListLoading={orderListLoading}
				orderListError={orderListError}
				title={"Pending Orders"}
			/>
			</RequirePermission >

		</LayoutAdmin>
	);
};

export default PendingOrdersPage;
