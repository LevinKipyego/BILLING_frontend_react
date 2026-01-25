import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  return Boolean(localStorage.getItem("access_token"));
};

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
