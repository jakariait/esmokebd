import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AddCategory from "../component/componentAdmin/AddCategory.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const AddNewCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="ORDERS" title="Orders Details" />
      <RequirePermission permission="category">
        <AddCategory />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default AddNewCategoryPage;
