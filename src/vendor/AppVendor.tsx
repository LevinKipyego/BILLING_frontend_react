import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

import DashboardLayout from "./components/layouts/DashboardLayout";

import DashboardHome from "./pages/dashboard/DashboardHome";
import VendorProfilePage from "./pages/dashboard/VendorProfile";

import Plans from "./pages/dashboard/Plans";
import Mikrotiks from "./pages/dashboard/Mikrotiks";
import Nas from "./pages/dashboard/Nas";
import MikrotikConfig from "./pages/dashboard/MikrotikConfig";

import Mpesa from "./pages/dashboard/MpesaConfig";
import C2BConfig from "./pages/dashboard/C2BConfig";

import UsersPage from "./pages/dashboard/Users";

import NetworkHealth from "./pages/dashboard/NetworkHealth";
import NetworkDetailed from "./pages/dashboard/NetworkDetailed";

import SessionDetail from "./pages/dashboard/SessionDetail";
import SessionsPage from "./pages/dashboard/SessionPage";

import StkTransactions from "./pages/dashboard/StkTransactions";
import C2bTransactions from "./pages/dashboard/C2bTransactions";

import PPPoESubscriptionPage from "./pages/dashboard/PpoeSubsicriptions";
import PppoeCredentialPage from "./pages/dashboard/PppoeCredentials";

import HotspotSubscriptionPage from "./pages/dashboard/HotspotSubscription";
import HotspotCredentialPage from "./pages/dashboard/HotspotCredentials";

import ProtectedRoute from "../../ProtectedRoute";
import AuthWatcher from "./AuthWatcher";

export default function AppVendor() {
  return (
    <>
      <AuthWatcher />

      <Routes>
        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route index element={<Home />} />

        <Route
          path="signup"
          element={<Signup />}
        />

        <Route
          path="login"
          element={<Login />}
        />

        {/* =========================
            PROTECTED ROUTES
        ========================= */}

        <Route element={<ProtectedRoute />}>
          <Route
            path="dashboard"
            element={<DashboardLayout />}
          >
            {/* Dashboard Home */}
            <Route
              index
              element={<DashboardHome />}
            />

            {/* Vendor Profile */}
            <Route
              path="profile"
              element={<VendorProfilePage />}
            />

            {/* Plans */}
            <Route
              path="plans"
              element={<Plans />}
            />

            {/* NAS */}
            <Route
              path="nas"
              element={<Nas />}
            />

            {/* MikroTik */}
            <Route
              path="mikrotik"
              element={<Mikrotiks />}
            />

            <Route
              path="mikrotik/configurations"
              element={<MikrotikConfig />}
            />

            {/* M-Pesa */}
            <Route
              path="mpesa"
              element={<Mpesa />}
            />

            <Route
              path="mpesa/c2b"
              element={<C2BConfig />}
            />

            {/* Transactions */}
            <Route
              path="transactions"
              element={<StkTransactions />}
            />

            <Route
              path="transactions/c2b"
              element={<C2bTransactions />}
            />

            {/* PPPoE */}
            <Route
              path="pppoe/credentials/list"
              element={<PppoeCredentialPage />}
            />

            <Route
              path="pppoe/subscriptions/list"
              element={<PPPoESubscriptionPage />}
            />

            {/* Hotspot */}
            <Route
              path="hotspot/credentials/list"
              element={<HotspotCredentialPage />}
            />

            <Route
              path="hotspot/subscriptions/list"
              element={<HotspotSubscriptionPage />}
            />

            {/* Users */}
            <Route
              path="users"
              element={<UsersPage />}
            />

            {/* Network */}
            <Route
              path="network"
              element={<NetworkHealth />}
            />

            <Route
              path="routers/:id"
              element={<NetworkDetailed />}
            />

            {/* Sessions */}
            <Route
              path="sessions/dashboard"
              element={<SessionsPage />}
            />

            <Route
              path="sessions/:id"
              element={<SessionDetail />}
            />
          </Route>
        </Route>

        {/* =========================
            FALLBACK
        ========================= */}

        <Route
          path="*" element={<NotFound />}
        />
      </Routes>
    </>
  );
}