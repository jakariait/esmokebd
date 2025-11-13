import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import SubCategoryManager from "../component/componentAdmin/SubCategoryManager.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import EditSubCategory from "../component/componentAdmin/EditSubCategory.jsx";

const SubCategoryListPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="SUB CATEGORY" title="View All Sub Categories" />
      <RequirePermission permission="sub_category">
        <SubCategoryManager />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default SubCategoryListPage;
