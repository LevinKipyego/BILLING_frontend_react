
import { Navigate, Outlet, useLocation } from "react-router-dom";

const LOGIN_PATH = "/login";
const ONBOARDING_PATH = "/onboarding";

export default function OnboardingGuard() {
  const location = useLocation();

  const token = localStorage.getItem("access_token");
  const isOnboardingComplete =
    localStorage.getItem("onboarding_complete") === "true";

  // 1. Unauthenticated users -> Redirect to Login
  if (!token) {
    return <Navigate to={LOGIN_PATH} state={{ from: location }} replace />;
  }

  // 2. Incomplete onboarding & trying to access operational routes -> Redirect to Onboarding
  if (!isOnboardingComplete && location.pathname !== ONBOARDING_PATH) {
    return <Navigate to={ONBOARDING_PATH} replace />;
  }

  // 3. Completed onboarding & trying to manually visit /onboarding -> Redirect to Dashboard
  if (isOnboardingComplete && location.pathname === ONBOARDING_PATH) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}