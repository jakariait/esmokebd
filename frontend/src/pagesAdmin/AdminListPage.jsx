import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AdminList from "../component/componentAdmin/AdminList.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const AdminListPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb
        title={"View All System Users"}
        pageDetails={"SYSTEM USERS"}
      />
      <RequirePermission permission="admin-users">
        <AdminList />
      </RequirePermission >


    </LayoutAdmin>
  );
};

export default AdminListPage;
