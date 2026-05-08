const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "http://192.168.100.88:8000/api";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Helper to notify all waiting requests once token is refreshed
function onTokenRefreshed(token: string) {
  refreshSubscribers.map((callback) => callback(token));
  refreshSubscribers = [];
}

// Helper to add a request to the waitlist
function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  let token = localStorage.getItem("access_token");
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized
  if (res.status === 401) {
    const refresh = localStorage.getItem("refresh_token");

    if (!refresh) {
      logout();
      return Promise.reject("No refresh token");
    }

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshRes = await fetch(`${API_BASE}/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        });

        if (!refreshRes.ok) {
          throw new Error("Refresh failed");
        }

        const refreshData = await refreshRes.json();
        const newToken = refreshData.access;

        localStorage.setItem("access_token", newToken);
        isRefreshing = false;
        
        // Notify all requests waiting for this token
        onTokenRefreshed(newToken);
      } catch (err) {
        isRefreshing = false;
        logout();
        return Promise.reject(err);
      }
    }

    // This part handles the "Instant" wait for the ongoing refresh
    return new Promise((resolve, reject) => {
      addRefreshSubscriber(async (newToken: string) => {
        try {
          const retryHeaders = new Headers(options.headers);
          retryHeaders.set("Content-Type", "application/json");
          retryHeaders.set("Authorization", `Bearer ${newToken}`);

          const retryRes = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: retryHeaders,
          });

          if (!retryRes.ok) {
            // If the retry also fails with 401, clear everything
            if (retryRes.status === 401) logout();
            return reject("Retry failed");
          }

          resolve(await retryRes.json());
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  // Standard response handling
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Error ${res.status}: Request failed`);
  }

  return res.json();
}

function logout() {
  // Clear all auth data
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("vendor_id"); // Clear vendor info too

  // Redirect to login with the message your UI is expecting
  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login?message=session-expired";
  }
}