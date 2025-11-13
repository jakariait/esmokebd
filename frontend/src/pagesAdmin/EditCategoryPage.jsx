import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import EditCategory from "../component/componentAdmin/EditCategory.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import CategoryManager from "../component/componentAdmin/CategoryManager.jsx";

const EditCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="CATEGORY" title="View All Categories" />
      <RequirePermission permission="category">
        <EditCategory />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default EditCategoryPage;
