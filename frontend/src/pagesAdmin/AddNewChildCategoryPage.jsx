import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AddChildCategory from "../component/componentAdmin/AddChildCategory.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import ChildCategoryManager from "../component/componentAdmin/ChildCategoryManager.jsx";

const AddNewChildCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="CHILD CATEGORY" title="Child Categories" />
      <RequirePermission permission="child_category" >
        <AddChildCategory />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default AddNewChildCategoryPage;
