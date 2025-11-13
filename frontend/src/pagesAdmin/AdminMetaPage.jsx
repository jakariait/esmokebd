import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AdminMetaForm from "../component/componentAdmin/AdminMetaForm.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const GeneralInfoPage = ({ pageDetails, title }) => {
  return (
    <LayoutAdmin>
      <div>
        <Breadcrumb title={"SEO for HomePage"} pageDetails={"WEBSITE CONFIG"} />
        {/* Form Section */}
        <RequirePermission permission="home_page_seo">
          <AdminMetaForm />
        </RequirePermission>
      </div>
    </LayoutAdmin>
  );
};

export default GeneralInfoPage;
