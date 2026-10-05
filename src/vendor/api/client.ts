import { BaseUrl } from "../../BaseUrl";
import { v4 as uuidv4 } from "uuid";

const API_BASE =
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

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const makeHeaders = (token?: string) => {
    const headers = new Headers(options.headers);

    if (!(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  };

  const access = localStorage.getItem("access_token");

  let response = await fetch(
    `${API_BASE}${endpoint}`,
    {
      ...options,
      headers: makeHeaders(access || undefined),
    }
  );

  /* ------------------------------------------ */
  /* SUCCESS                                    */
  /* ------------------------------------------ */

  if (response.ok) {
    return response.json().catch(() => ({}));
  }

  /* ------------------------------------------ */
  /* NON-AUTHENTICATION ERROR                   */
  /* ------------------------------------------ */

  if (response.status !== 401 && response.status !== 403) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error.detail ||
      error.message ||
      error.error ||
      `HTTP ${response.status}`
    );
  }

  /* ------------------------------------------ */
  /* GET REFRESH TOKEN                          */
  /* ------------------------------------------ */

  const refresh = localStorage.getItem("refresh_token");

  if (!refresh) {
    await logout(false);
    throw new Error("No refresh token.");
  }

  /* ------------------------------------------ */
  /* REFRESH TOKEN                              */
  /* ------------------------------------------ */

  if (!isRefreshing) {
    isRefreshing = true;

    try {
      const refreshResponse = await fetch(
        `${API_BASE}/token/refresh/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh,
          }),
        }
      );

      if (!refreshResponse.ok) {
        throw new Error("Refresh token expired.");
      }

      const refreshData = await refreshResponse.json();

      const newAccess = refreshData.tokens.access;
      const newRefresh = refreshData.tokens.refresh;

      if (!newAccess || !newRefresh) {
        throw new Error("Invalid refresh response.");
      }

      localStorage.setItem(
        "access_token",
        newAccess
      );

      localStorage.setItem(
        "refresh_token",
        newRefresh
      );

      window.dispatchEvent(
        new Event("auth-changed")
      );

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
  /* WAIT FOR REFRESH AND RETRY                 */
  /* ------------------------------------------ */

  return new Promise<T>((resolve, reject) => {
    subscribeTokenRefresh(async (token) => {
      if (!token) {
        reject(
          new Error("Authentication refresh failed.")
        );
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
          const error =
            await retry.json().catch(() => ({}));

          throw new Error(
            error.detail ||
            error.message ||
            error.error ||
            `HTTP ${retry.status}`
          );
        }

        resolve(
          await retry.json().catch(() => ({}))
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



type ApiPostOptions = {
    idempotent?: boolean;
    idempotencyKey?: string;
};

export function apiPost<T>(
    endpoint: string,
    body?: unknown,
    options: ApiPostOptions = {},
): Promise<T> {
    const headers: Record<string, string> = {};

    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    if (options.idempotent) {
        headers["Idempotency-Key"] =
            options.idempotencyKey ?? uuidv4();
    }

    return apiFetch<T>(endpoint, {
        method: "POST",
        headers,
        ...(body !== undefined && {
            body: JSON.stringify(body),
        }),
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