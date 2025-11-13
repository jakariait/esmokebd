import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import ViewOrder from "../component/componentAdmin/ViewOrder.jsx";

const AddNewCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="CATEGORY" title="View All Categories" />
      <ViewOrder/>
    </LayoutAdmin>
  );
};

export default AddNewCategoryPage;
