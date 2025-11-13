import React from 'react';
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import EditSubCategory from "../component/componentAdmin/EditSubCategory.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import AddSubCategory from "../component/componentAdmin/AddSubCategory.jsx";

const EditSubCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="SUB CATEGORY" title="Edit Sub Categories" />
      <RequirePermission permission="sub_category">
        <EditSubCategory/>
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default EditSubCategoryPage;