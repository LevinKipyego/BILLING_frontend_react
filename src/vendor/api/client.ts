import { BaseUrl } from "../../BaseUrl";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  `${BaseUrl}/api`;

let isRefreshing = false;

let refreshSubscribers: Array<(token: string | null) => void> = [];

/* -------------------------------------------------- */
/* Refresh Queue                                      */
/* -------------------------------------------------- */

function subscribeTokenRefresh(
  callback: (token: string | null) => void
) {
  refreshSubscribers.push(callback);
}

function notifySubscribers(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

/* -------------------------------------------------- */
/* Logout                                             */
/* -------------------------------------------------- */

export async function logout(callApi = true) {
  try {
    if (callApi) {
      const refresh = localStorage.getItem("refresh_token");
      const access = localStorage.getItem("access_token");

      if (refresh && access) {
        await fetch(`${API_BASE}/logout/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh,
          }),
        });
      }
    }
  } catch {
    // Ignore network errors.
    // We still want to log the user out locally.
  }

  // Clear local authentication state
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("auth_ready");

  // Notify other tabs
  localStorage.setItem(
    "logout_event",
    Date.now().toString()
  );

  // Notify this tab
  window.dispatchEvent(
    new Event("auth:logout")
  );

  // Redirect
  if (!window.location.pathname.startsWith("/login")) {
    window.location.replace(
      "/login?message=session-expired"
    );
  }
}

/* -------------------------------------------------- */
/* API FETCH                                          */
/* -------------------------------------------------- */

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let access = localStorage.getItem("access_token");

  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  console.log("apiFetch:", endpoint);

  if (access) {
    headers.set(
      "Authorization",
      `Bearer ${access}`
    );
  }

  let response = await fetch(
    `${API_BASE}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  console.log(
    "apiFetch response:",
    endpoint,
    response.status
);
  /* ------------------------------------------ */
  /* SUCCESS                                    */
  /* ------------------------------------------ */

  if (response.ok) {
    return response.json().catch(() => ({}));
  }

  /* ------------------------------------------ */
  /* ONLY HANDLE TOKEN EXPIRY                   */
  /* ------------------------------------------ */

  if (
    response.status !== 401 &&
    response.status !== 403
) { 
    const error =
      await response.json().catch(() => ({}));

    throw new Error(
      error.message ||
      `HTTP ${response.status}`
    );
  }

  const refresh =
    localStorage.getItem("refresh_token");

  if (!refresh) {
    await logout(false);
    throw new Error("No refresh token.");
  }

  /* ------------------------------------------ */
  /* FIRST REQUEST DOES REFRESH                 */
  /* ------------------------------------------ */

  if (!isRefreshing) {
    isRefreshing = true;

    try {
      const refreshResponse = await fetch(
        `${API_BASE}/token/refresh/`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            refresh,
          }),
        }
      );

      if (!refreshResponse.ok) {
        throw new Error(
          "Refresh token expired."
        );
      }

      const refreshData =
        await refreshResponse.json();

      const newAccess =
        refreshData.tokens.access;

      const newRefresh =
        refreshData.tokens.refresh;

      localStorage.setItem(
        "access_token",
        newAccess
      );

      localStorage.setItem(
        "refresh_token",
        newRefresh
      );

      window.dispatchEvent(new Event("auth-changed"));

      notifySubscribers(newAccess);
    } catch (err) {
      notifySubscribers(null);

      await logout(false);

      throw err;
    } finally {
      isRefreshing = false;
    }
  }

  /* ------------------------------------------ */
  /* WAIT FOR REFRESH                           */
  /* ------------------------------------------ */

  return new Promise<T>((resolve, reject) => {
    subscribeTokenRefresh(async (token) => {
      if (!token) {
        reject("Refresh failed.");
        return;
      }

      try {
        const retryHeaders =
          new Headers(options.headers);

        if (!(options.body instanceof FormData)) {
          retryHeaders.set(
            "Content-Type",
            "application/json"
          );
        }

        retryHeaders.set(
          "Authorization",
          `Bearer ${token}`
        );

        const retry = await fetch(
          `${API_BASE}${endpoint}`,
          {
            ...options,
            headers: retryHeaders,
          }
        );

        if (!retry.ok) {
          throw new Error(
            `HTTP ${retry.status}`
          );
        }

        resolve(
          await retry
            .json()
            .catch(() => ({}))
        );
      } catch (err) {
        reject(err);
      }
    });
  });
}


export function apiGet<T>(
    endpoint: string,
) {
    return apiFetch<T>(endpoint);
}

export function apiPost<T>(
    endpoint: string,
    body?: unknown,
) {
    return apiFetch<T>(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export function apiPatch<T>(
    endpoint: string,
    body?: unknown,
) {
    return apiFetch<T>(endpoint, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
}

export function apiDelete<T>(
    endpoint: string,
) {
    return apiFetch<T>(endpoint, {
        method: "DELETE",
    });
}