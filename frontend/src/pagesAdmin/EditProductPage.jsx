import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import UpdateProduct from "../component/componentAdmin/UpdateProduct.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import ViewAllProducts from "../component/componentAdmin/ViewAllProducts.jsx";

const EditProductPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="PRODUCT" title="Edit Product" />
      <RequirePermission permission="edit_products">
        <UpdateProduct />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default EditProductPage;
