import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import AppVendor from "./vendor/AppVendor";


import Login from "./vendor/pages/Login";
import Signup from "./vendor/pages/SignUp";
import Home from "./vendor/pages/Home";
import NotFound from "./vendor/pages/NotFound";

import DashboardLayout from "./vendor/components/layouts/DashboardLayout";

import DashboardHome from "./vendor/pages/dashboard/DashboardHome";
import VendorProfilePage from "./vendor/pages/dashboard/VendorProfile";

import Plans from "./vendor/pages/dashboard/Plans";
import Mikrotiks from "./vendor/pages/dashboard/Mikrotiks";
import Nas from "./vendor/pages/dashboard/Nas";
import MikrotikConfig from "./vendor/pages/dashboard/MikrotikConfig";

import Mpesa from "./vendor/pages/dashboard/MpesaConfig";
import C2BConfig from "./vendor/pages/dashboard/C2BConfig";

import UsersPage from "./vendor/pages/dashboard/Users";

import NetworkHealth from "./vendor/pages/dashboard/NetworkHealth";
import NetworkDetailed from "./vendor/pages/dashboard/NetworkDetailed";

import SessionDetail from "./vendor/pages/dashboard/SessionDetail";
import SessionsPage from "./vendor/pages/dashboard/SessionPage";

import StkTransactions from "./vendor/pages/dashboard/StkTransactions";
import C2bTransactions from "./vendor/pages/dashboard/C2bTransactions";

import PPPoESubscriptionPage from "./vendor/pages/dashboard/PpoeSubsicriptions";
import PppoeCredentialPage from "./vendor/pages/dashboard/PppoeCredentials";

import HotspotSubscriptionPage from "./vendor/pages/dashboard/HotspotSubscription";
import HotspotCredentialPage from "./vendor/pages/dashboard/HotspotCredentials";

import ProtectedRoute from "../ProtectedRoute";
import AuthWatcher from "./vendor/AuthWatcher";
import UserProfile from "./vendor/pages/dashboard/users/UserProfile";
export default function App() {
  return (

    
    <Router>
      
     
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

              <Route
                  path="users/detailed/:id"
                  element={<UserProfile />}
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
     
    </Router>
  );
}
    
  