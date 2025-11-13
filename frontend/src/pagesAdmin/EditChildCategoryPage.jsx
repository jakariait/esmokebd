import React from 'react';
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import EditChildCategory from "../component/componentAdmin/EditChildCategory.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import AddChildCategory from "../component/componentAdmin/AddChildCategory.jsx";

const EditChildCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="CHILD CATEGORY" title="Edit Child Categories" />
      <RequirePermission permission="child_category" >
        <EditChildCategory/>
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default EditChildCategoryPage;