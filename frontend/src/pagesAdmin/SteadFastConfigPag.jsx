import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AdminSteadfastConfig from "../component/componentAdmin/AdminSteadfastConfig.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const GeneralInfoPage = ({ pageDetails, title }) => {
  return (
    <LayoutAdmin>
      <div>
        <Breadcrumb title={"Steadfast API"} pageDetails={"WEBSITE CONFIG"} />
        <RequirePermission permission="steadfast_api">
          <AdminSteadfastConfig />
        </RequirePermission>
      </div>
    </LayoutAdmin>
  );
};

export default GeneralInfoPage;
