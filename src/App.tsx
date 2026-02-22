import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Home from "./pages/Home";
import DashboardLayout from "./components/layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Plans from "./pages/dashboard/Plans";                                                                                                                                    
import Mikrotiks from "./pages/dashboard/Mikrotiks";
import Nas from "./pages/dashboard/Nas";
import MikrotikConfig from "./pages/dashboard/MikrotikConfig";
import Mpesa from "./pages/dashboard/MpesaConfig";                                                                                                                                                                                                                          
import UsersPage from "./pages/dashboard/Users";
import NetworkHealth from "./pages/dashboard/NetworkHealth";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        

        {/* Dashboard (protected later) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="plans" element={<Plans />} />
          <Route path="nas" element={<Nas />} />
          <Route path="mikrotik" element={<Mikrotiks />} />
          <Route path="mpesa" element={<Mpesa />} />
          <Route path="mikroconfig" element={<MikrotikConfig />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="network" element={<NetworkHealth />} />
        </Route>

        {/* Fallback */}
        {/*<Route path="*" element={<Navigate to="/" replace />} />*/}
      </Routes>
    </Router>
  );
}