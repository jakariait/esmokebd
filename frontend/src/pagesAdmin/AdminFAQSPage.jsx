import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AdminFAQSection from "../component/componentAdmin/AdminFAQSection.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const AddNewCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="ABOUT US" title="Update About Us" />
      <RequirePermission permission="faqs">
        <AdminFAQSection />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default AddNewCategoryPage;
