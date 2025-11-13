import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AddProductSize from "../component/componentAdmin/AddProductSize.jsx";
import ProductSizeManager from "../component/componentAdmin/ProductSizeManager.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const AddNewProductSizePage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="PRODUCT SIZE" title="Add New Product Size" />
      <RequirePermission permission="product_size" >
        <AddProductSize />
      </RequirePermission >
    </LayoutAdmin>
  );
};

export default AddNewProductSizePage;
