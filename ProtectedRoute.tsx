import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
};

const ProtectedRoute = () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login?message=authentication-required" replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // JWT exp is in seconds
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      // Token expired
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      return <Navigate to="/login?message=session-expired" replace />;
    }

    return <Outlet />;
  } catch (error) {
    // Invalid token
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    return <Navigate to="/login?message=session-expired" replace />;
  }
};

export default ProtectedRoute;