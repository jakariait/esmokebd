import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import ColorUpdater from "../component/componentAdmin/ColorUpdater.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const ColorUpdaterPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb
        pageDetails="WEBSITE CONFIG"
        title="Website Theme Color"
      />

      <RequirePermission permission="website_theme_color" >
        <ColorUpdater />

      </RequirePermission >
    </LayoutAdmin>
  );
};

export default ColorUpdaterPage;
