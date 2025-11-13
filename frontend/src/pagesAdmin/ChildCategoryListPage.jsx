import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import ChildCategoryManager from "../component/componentAdmin/ChildCategoryManager.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const ChildCategoryListPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb
        pageDetails="CHILD CATEGORY"
        title="View All Child Categories"
      />
      <RequirePermission permission="child_category" >
        <ChildCategoryManager />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default ChildCategoryListPage;
