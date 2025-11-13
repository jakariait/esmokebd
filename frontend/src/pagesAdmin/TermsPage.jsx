import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import PageEditor from "../component/componentAdmin/PageEditor.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const AddNewCategoryPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="TERM OF SERIVICES" title="Update Terms of Services" />
      <RequirePermission permission="about_terms-policies">
        <PageEditor title="Terms of Services" endpoint="terms" />
        <PageEditor title="Privacy Policy" endpoint="privacy" />
        <PageEditor title="Refund Policy" endpoint="refund" />
        <PageEditor title="Shipping Policy" endpoint="shipping" />
      </RequirePermission >



    </LayoutAdmin>
  );
};

export default AddNewCategoryPage;
