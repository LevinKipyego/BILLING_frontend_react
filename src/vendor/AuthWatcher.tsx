import { useCallback, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { logout } from "./api/client"; 

type JwtPayload = {
  exp: number;
};

const LOGIN_PATH = "/login";

export default function AuthWatcher() {
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
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
    } catch {
      logout(false);
    }
  }, [clearTimer]);

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
     * Another tab updated tokens or logged out.
     */
    const handleStorage = (event: StorageEvent) => {
      switch (event.key) {
        case "refresh_token":
        case "access_token":
          scheduleLogout();
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
     * Refresh timer after successful token refresh.
     */
    const handleAuthChanged = () => {
      scheduleLogout();
    };

    /**
     * Check expiry after computer sleep/tab inactivity.
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
  ]);

  return null;
}