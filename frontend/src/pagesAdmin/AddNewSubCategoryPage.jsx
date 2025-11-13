import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AddSubCategory from "../component/componentAdmin/AddSubCategory.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const AddNewSubCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="SUB CATEGORY" title="View All Sub Categories" />
      {/* AddSubCategory component */}

      <RequirePermission permission="sub_category">
        <AddSubCategory />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default AddNewSubCategoryPage;
