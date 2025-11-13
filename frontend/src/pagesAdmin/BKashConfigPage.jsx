import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AdminBkashConfig from "../component/componentAdmin/AdminBkashConfig.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const GeneralInfoPage = ({ pageDetails, title }) => {
  return (
    <LayoutAdmin>
      <div>
        <Breadcrumb
          title={"bKash Configuration"}
          pageDetails={"WEBSITE CONFIG"}
        />

        {/* Form Section */}
        <RequirePermission permission="bkash_api">
          <AdminBkashConfig />
        </RequirePermission>
      </div>
    </LayoutAdmin>
  );
};

export default GeneralInfoPage;
