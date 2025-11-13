import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AddProduct from "../component/componentAdmin/AddProduct.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const AddNewProductPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="PRODUCT" title="Add New Product" />
      <RequirePermission permission="add_products">
        <AddProduct />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default AddNewProductPage;
