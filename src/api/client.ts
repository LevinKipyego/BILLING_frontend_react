const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "http://192.168.100.88:8000/api";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  let token = localStorage.getItem("access_token");

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    const refresh = localStorage.getItem("refresh_token");

    if (!refresh) {
      logout();
      return Promise.reject("Missing refresh token");
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

        const data = await refreshRes.json();
        const newToken = data.access;

        localStorage.setItem("access_token", newToken);

        isRefreshing = false;
        onTokenRefreshed(newToken);
      } catch (err) {
        isRefreshing = false;
        logout();
        return Promise.reject(err);
      }
    }

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

          if (retryRes.status === 401) {
            logout();
            return reject("Unauthorized after retry");
          }

          const data = await retryRes.json().catch(() => ({}));
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Error ${res.status}`);
  }

  return data;
}

function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("auth_ready");

  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login?message=session-expired";
  }
}