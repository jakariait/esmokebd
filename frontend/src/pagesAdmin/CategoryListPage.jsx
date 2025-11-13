import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import CategoryManager from "../component/componentAdmin/CategoryManager.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import AddCategory from "../component/componentAdmin/AddCategory.jsx";

const CategoryListPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="CATEGORY" title="View All Categories" />
      <RequirePermission permission="category">
        <CategoryManager />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default CategoryListPage;
