import { Navigate, Outlet } from "react-router-dom";
import useAuthAdminStore from "../../store/AuthAdminStore.js";

const ProtectedRoute = () => {
  const { token } = useAuthAdminStore(); // Check if admin is logged in

  return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
