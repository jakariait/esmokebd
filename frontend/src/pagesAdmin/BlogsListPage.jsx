import React from 'react';
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import BlogList from "../component/componentAdmin/BlogList.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const BlogsListPage = () => {
  return (
    <LayoutAdmin>
      <div>
        <Breadcrumb title={"Create a Blog"} pageDetails={"BLOGS"} />
        <RequirePermission permission="blogs">
          <BlogList/>
        </RequirePermission>
      </div>
    </LayoutAdmin>
  );
};

export default BlogsListPage;