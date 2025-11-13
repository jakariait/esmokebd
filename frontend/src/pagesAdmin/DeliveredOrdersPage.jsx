import React, { useEffect } from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AllOrders from "../component/componentAdmin/AllOrders.jsx";
import useOrderStore from "../store/useOrderStore.js";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const DeliveredOrdersPage = () => {
	const {
		orderListByStatus,
		orderListLoading,
		orderListError,
		fetchAllOrders,
		currentPage,
		itemsPerPage,
	} = useOrderStore();

	useEffect(() => {
		fetchAllOrders("delivered", currentPage, itemsPerPage);
	}, [fetchAllOrders, currentPage, itemsPerPage]);

	return (
		<LayoutAdmin>
			<Breadcrumb pageDetails="ORDERS" title="View All Delivered Orders" />
			<RequirePermission permission="view_orders">

			<AllOrders
				allOrders={orderListByStatus.delivered}
				orderListLoading={orderListLoading}
				orderListError={orderListError}
				title={"Delivered Orders"}
			/>
			</RequirePermission >

		</LayoutAdmin>
	);
};

export default DeliveredOrdersPage;
