import { useCallback, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { logout } from "./api/client"; 

type JwtPayload = {
  exp: number;
};

const LOGIN_PATH = "/login";
const ONBOARDING_PATH = "/onboarding";

// Paths that un-onboarded users are permitted to visit
const ALLOWED_UNONBOARDED_PATHS = [
  LOGIN_PATH,
  ONBOARDING_PATH,
  "/dashboard",
  "/dashboard/profile",
  "/dashboard/plans",
  "/dashboard/nas",
  "/dashboard/mikrotik",
  "/dashboard/mikrotik/configurations",
  "/dashboard/mpesa",
  "/dashboard/mpesa/c2b",
  "/dashboard/transactions",
  "/dashboard/transactions/c2b",
  "/dashboard/pppoe/credentials/list",
  "/dashboard/pppoe/subscriptions/list",
  "/dashboard/hotspot/credentials/list",
  "/dashboard/hotspot/subscriptions/list",
  "/dashboard/users",
  "/dashboard/users/detailed",
  "/dashboard/network",
  "/dashboard/routers",
  "/dashboard/sessions/dashboard",
  "/dashboard/sessions",
  "/dashboard/sms/sms_providers/list",
];

export default function AuthWatcher() {
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * Verify onboarding completion status.
   * Redirects users to /onboarding if they navigate to paths outside the allowed list.
   */
  const checkOnboarding = useCallback(() => {
    const token = localStorage.getItem("access_token");
    const isOnboardingComplete = localStorage.getItem("onboarding_complete") === "true";
    const currentPath = window.location.pathname;

    if (token && !isOnboardingComplete) {
      // Check if current path matches or is a sub-path of an allowed route
      const isAllowed = ALLOWED_UNONBOARDED_PATHS.some(
        (path) => currentPath === path || currentPath.startsWith(`${path}/`)
      );

      if (!isAllowed) {
        window.location.replace(ONBOARDING_PATH);
      }
    }
  }, []);

  /**
   * Schedule automatic logout based on the refresh token expiry.
   */
  const scheduleLogout = useCallback(() => {
    clearTimer();

    const refresh = localStorage.getItem("refresh_token");

    // User is already logged out
    if (!refresh) {
      return;
    }

    try {
      const { exp } = jwtDecode<JwtPayload>(refresh);

      const expiresAt = exp * 1000;
      const delay = expiresAt - Date.now();

      if (delay <= 0) {
        logout(false);
        return;
      }

      timerRef.current = window.setTimeout(() => {
        logout(false);
      }, delay);

      // Verify onboarding configuration state
      checkOnboarding();
    } catch {
      logout(false);
    }
  }, [clearTimer, checkOnboarding]);

  /**
   * Verify the refresh token whenever the tab becomes active.
   */
  const verifySession = useCallback(() => {
    const refresh = localStorage.getItem("refresh_token");

    if (!refresh) {
      return;
    }

    try {
      const { exp } = jwtDecode<JwtPayload>(refresh);

      if (exp * 1000 <= Date.now()) {
        logout(false);
      } else {
        scheduleLogout();
      }
    } catch {
      logout(false);
    }
  }, [scheduleLogout]);

  useEffect(() => {
    scheduleLogout();

    /**
     * Another tab updated tokens, onboarding status, or logged out.
     */
    const handleStorage = (event: StorageEvent) => {
      switch (event.key) {
        case "refresh_token":
        case "access_token":
          scheduleLogout();
          break;

        case "onboarding_complete":
          checkOnboarding();
          break;

        case "logout_event":
          logout(false);
          break;

        default:
          break;
      }
    };

    /**
     * Logout triggered within this tab.
     */
    const handleLogout = () => {
      clearTimer();

      if (!window.location.pathname.startsWith(LOGIN_PATH)) {
        window.location.replace(
          "/login?message=session-expired"
        );
      }
    };

    /**
     * Refresh timer & check onboarding state after authentication update.
     */
    const handleAuthChanged = () => {
      scheduleLogout();
    };

    /**
     * Check expiry & onboarding status after computer sleep/tab inactivity.
     */
    const handleFocus = () => verifySession();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        verifySession();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("auth-changed", handleAuthChanged);
    window.addEventListener("auth:logout", handleLogout);
    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      clearTimer();

      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("auth-changed", handleAuthChanged);
      window.removeEventListener("auth:logout", handleLogout);
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, [
    clearTimer,
    scheduleLogout,
    verifySession,
    checkOnboarding,
  ]);

  return null;
}