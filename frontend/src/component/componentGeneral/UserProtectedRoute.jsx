import { Navigate, Outlet } from "react-router-dom";
import useAuthUserStore from "../../store/AuthUserStore.js";

const UserProtectedRoute = () => {
  const { token } = useAuthUserStore(); // Check if admin is logged in

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default UserProtectedRoute;
