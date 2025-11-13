import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import MarqueeAdmin from "../component/componentAdmin/MarqueeAdmin.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const GeneralInfoPage = ({ pageDetails, title }) => {
  return (
    <LayoutAdmin>
      <div>
        <Breadcrumb title={"Scroll Text"} pageDetails={"WEBSITE CONFIG"} />
        {/* Form Section */}
        <RequirePermission permission="scroll_text">
          <MarqueeAdmin />
        </RequirePermission>
      </div>
    </LayoutAdmin>
  );
};

export default GeneralInfoPage;
