import React from "react";
import UpdateUserForm from "../component/componentGeneral/UpdateUserForm.jsx";
import useAuthUserStore from "../store/AuthUserStore.js";
import UserLayout from "../component/componentGeneral/UserLayout.jsx";

const UpdateUserPage = () => {
  const { token } = useAuthUserStore(); // adjust based on your store logic

  if (!token) return <p>Please login first</p>;

  return (
    <UserLayout>
      <UpdateUserForm token={token} />
    </UserLayout>
  );
};

export default UpdateUserPage;
