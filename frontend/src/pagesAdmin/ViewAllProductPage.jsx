import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import ViewAllProducts from "../component/componentAdmin/ViewAllProducts.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import AddProduct from "../component/componentAdmin/AddProduct.jsx";

const ViewAllProductPage = () => {
  return (
    <LayoutAdmin>
      {/* Breadcrumb Section */}
      <Breadcrumb title={"View All Products"} pageDetails={"PRODUCTS"} />
      <RequirePermission permission="view_products">
        <ViewAllProducts />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default ViewAllProductPage;
