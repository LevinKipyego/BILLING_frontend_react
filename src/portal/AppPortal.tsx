import { Routes, Route } from "react-router-dom";

import PortalLayout from "./layouts/PortalLayout";

import PortalLogin from "./pages/PortalLogin";
import PortalDashboard from "./pages/PortalDashboard";
import PortalPackages from "./pages/PortalPackages";
import PortalTransactions from "./pages/PortalTransactions";
import PortalProfile from "./pages/PortalProfile";
import PortalSessions from "./pages/PortalSessions";

import PortalProtectedRoute from "./components/PortalProtectRoute";

export default function AppPortal() {
  return (
    <Routes>
      <Route path="/login" element={<PortalLogin />} />

      <Route element={<PortalProtectedRoute />}>
        <Route element={<PortalLayout />}>
          <Route index element={<PortalDashboard />} />

          <Route path="packages" element={<PortalPackages />} />

          <Route path="transactions" element={<PortalTransactions />} />

          <Route path="profile" element={<PortalProfile />} />

          <Route path="sessions" element={<PortalSessions />} />
        </Route>
      </Route>
    </Routes>
  );
}