import React from "react";
import GeneralInfoForm from "../component/componentAdmin/GeneralInfoForm.jsx";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const GeneralInfoPage = ({ pageDetails, title }) => {
  return (
    <LayoutAdmin>
      <div>
        <Breadcrumb title={"General Info"} pageDetails={"WEBSITE CONFIG"} />
        {/* Form Section */}
        <RequirePermission permission="general_info">
          <GeneralInfoForm />
        </RequirePermission>
      </div>
    </LayoutAdmin>
  );
};

export default GeneralInfoPage;
