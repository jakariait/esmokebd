import React from "react";
import UserLayout from "../component/componentGeneral/UserLayout.jsx";
import ChangePassword from "../component/componentGeneral/ChangePassword.jsx";
import useAuthUserStore from "../store/AuthUserStore.js";

const ChangePasswordPage = () => {
  const { token } = useAuthUserStore(); // adjust based on your store logic

  if (!token) return <p>Please login first</p>;

  return (
    <UserLayout>
      <ChangePassword token={token} />
    </UserLayout>
  );
};

export default ChangePasswordPage;
