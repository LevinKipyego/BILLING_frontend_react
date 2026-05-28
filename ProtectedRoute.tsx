import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
  vendor_id?: string;
  role?: string;
};

const ProtectedRoute = () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return (
      <Navigate
        to="/vendor/login?message=authentication-required"
        replace
      />
    );
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const now = Date.now() / 1000;

    if (decoded.exp < now) {
      localStorage.clear();
      return (
        <Navigate
          to="/vendor/login?message=session-expired"
          replace
        />
      );
    }

    // optional safety check
    if (!decoded.vendor_id) {
      localStorage.clear();
      return (
        <Navigate
          to="/vendor/login?message=invalid-session"
          replace
        />
      );
    }

    return <Outlet />;
  } catch {
    localStorage.clear();
    return (
      <Navigate
        to="/vendor/login?message=session-expired"
        replace
      />
    );
  }
};

export default ProtectedRoute;