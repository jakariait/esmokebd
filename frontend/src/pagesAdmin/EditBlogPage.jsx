import React from 'react';
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import EditBlog from "../component/componentAdmin/EditBlog.jsx";

const EditBlogPage = () => {
  return (
    <LayoutAdmin>
      <div>
        <Breadcrumb title={"Edit Blog"} pageDetails={"BLOGS"} />
        <RequirePermission permission="blogs">
          <EditBlog />
        </RequirePermission>
      </div>
    </LayoutAdmin>
  );
};

export default EditBlogPage;