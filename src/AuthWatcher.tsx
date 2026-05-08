import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
};

const AuthWatcher = () => {

  useEffect(() => {

    let timer: ReturnType<typeof setTimeout>;

    const setupWatcher = () => {

      const token = localStorage.getItem("access_token");

      // No token → nothing to watch
      if (!token) return;

      try {

        const decoded = jwtDecode<JwtPayload>(token);

        // Convert exp to milliseconds
        const expirationTime = decoded.exp * 1000;

        // Remaining lifetime
        const timeout = expirationTime - Date.now();

        // Already expired
        if (timeout <= 0) {
          logout();
          return;
        }

        // Auto logout exactly when token expires
        timer = setTimeout(() => {
          logout();
        }, timeout);

      } catch {
        logout();
      }
    };

    // Start watcher
    setupWatcher();

    // Listen for token changes across tabs/windows
    const handleStorageChange = () => {

      // Clear previous timer
      if (timer) {
        clearTimeout(timer);
      }

      // Recreate watcher with new token
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

function logout() {

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  // Prevent redirect loop
  if (window.location.pathname !== "/login") {

    window.location.href =
      "/login?message=session-expired";
  }
}

export default AuthWatcher;