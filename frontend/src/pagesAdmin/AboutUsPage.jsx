import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import PageEditor from "../component/componentAdmin/PageEditor.jsx";
import AbandonedCartsContainer from "../component/componentAdmin/AbandonedCartsContainer.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const AddNewCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="ABOUT US" title="Update About Us" />
      <RequirePermission permission="about_terms-policies">
        <PageEditor title="About Us" endpoint="about" />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default AddNewCategoryPage;
