import { Routes, Route } from "react-router-dom";

import PortalLayout from "./layouts/PortalLayout";

import PortalLogin from "./pages/PortalLogin";
import PortalDashboard from "./pages/PortalDashboard";
import PortalPackages from "./pages/PortalPackages";
import PortalTransactions from "./pages/PortalTransactions";
import PortalProfile from "./pages/PortalProfile";
import PortalSessions from "./pages/PortalSessions";

import PortalProtectedRoute from "./components/PortalProtectRoute";
import PortalLanding from "./pages/PortalLanding";
import NotFound from "../pages/NotFound";
import PortalSupport from "./pages/PortalSupport";
import PortalDashboardFaq from "./pages/PortalDashboardFaq";
import PortalNoticeBanner from "./pages/PortalNoticeBurner";
import PortalSpeedTest from "./pages/PortalSpeedTest";
import PortalRenew from "./pages/PortalRenew";
import PortalRouterControl from "./pages/PortalRouterControl";

export default function AppPortal() {
  return (
    <Routes>

    <Route path="*" element={<NotFound />} />

      <Route path="/home" element={<PortalLanding />} />
      <Route path="/login" element={<PortalLogin />} />

      <Route element={<PortalProtectedRoute />}>
        <Route element={<PortalLayout />}>
          <Route index element={<PortalDashboard />} />

          <Route path="packages" element={<PortalPackages />} />

          <Route path="transactions" element={<PortalTransactions />} />

          <Route path="profile" element={<PortalProfile />} />

          <Route path="sessions" element={<PortalSessions />} />
          
          <Route path="support" element={<PortalSupport />} />

          <Route path="faq" element={<PortalDashboardFaq />} />

          <Route path="notice" element={<PortalNoticeBanner daysRemaining={0} accountStatus="active" />} />

          <Route path="reboot" element={<PortalRouterControl />} />

          <Route path="speedtest" element={<PortalSpeedTest />} />

          <Route path="renew" element={<PortalRenew />} />



        </Route>
      </Route>
    </Routes>
  );
}