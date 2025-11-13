import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import SocialMediaLinks from "../component/componentAdmin/SocialMediaLinks.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const SocialLinkUpdaterPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb
        pageDetails={"WEBSITE CONFIG"}
        title={"Social Media Links"}
      />
      <RequirePermission permission="website_theme_color" >
        <SocialMediaLinks />
      </RequirePermission >
    </LayoutAdmin>
  );
};

export default SocialLinkUpdaterPage;
