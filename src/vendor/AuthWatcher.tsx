import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { BaseUrl } from "../BaseUrl";

type JwtPayload = {
  exp: number;
};

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  `${BaseUrl}/api`;

const AuthWatcher = () => {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const logout = async () => {
      const token = localStorage.getItem("access_token");

      try {
        if (token) {
          await fetch(`${API_BASE}/logout/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        }
      } catch (err) {
        console.warn("Logout API failed:", err);
      }

      // ✅ CLEAR AUTH STATE
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("auth_ready");

      // ✅ SAFE REDIRECT
      if (!window.location.pathname.includes("/vendor/login")) {
        window.location.href =
          "/vendor/login?message=session-expired";
      }
    };

    const setupWatcher = () => {
      const token = localStorage.getItem("access_token");

      if (!token) return;

      try {
        const decoded = jwtDecode<JwtPayload>(token);

        const expirationTime = decoded.exp * 1000;
        const now = Date.now();

        const timeLeft = expirationTime - now;

        // =====================================
        // IMPORTANT:
        // DO NOT AUTO LOGOUT ON EXPIRY
        // apiFetch handles token refresh
        // =====================================
        if (timeLeft <= 0) {
          return;
        }

        // =====================================
        // OPTIONAL WARNING BEFORE EXPIRY
        // =====================================
        const warningTime = timeLeft - 60 * 1000;

        if (warningTime > 0) {
          timer = setTimeout(() => {
            console.warn("Session expiring soon...");
          }, warningTime);
        }

      } catch {
        logout();
      }
    };

    // =====================================
    // INITIAL CHECK
    // =====================================
    setupWatcher();

    // =====================================
    // SYNC ACROSS TABS
    // =====================================
    const handleStorageChange = () => {
      if (timer) {
        clearTimeout(timer);
      }

      setupWatcher();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }

      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  return null;
};

export default AuthWatcher;