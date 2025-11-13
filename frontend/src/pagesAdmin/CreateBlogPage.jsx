import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AddBlog from "../component/componentAdmin/AddBlog.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const CreateBlogPage = () => {
  return (
    <LayoutAdmin>
      <div>
        <Breadcrumb title={"Create a Blog"} pageDetails={"BLOGS"} />
        <RequirePermission permission="blogs">
          <AddBlog />
        </RequirePermission>
      </div>
    </LayoutAdmin>
  );
};

export default CreateBlogPage;
