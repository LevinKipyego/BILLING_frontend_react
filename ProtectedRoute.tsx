import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = () => {
    const token =
        localStorage.getItem("access_token");

    if (!token) {
        return (
            <Navigate
                replace
                to="/login?message=authentication-required"
            />
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;