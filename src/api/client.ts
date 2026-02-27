const API_BASE = import.meta.env.VITE_API_BASE || "http://192.168.100.88:8000/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access_token"); // Ensure this matches your login save key

  console.log("LocalStorage 'access_token' value:", token); 

  if (!token) {
    console.error("No token found! Redirecting to login...");
    // window.location.href = "/login"; 
  }

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  console.log(`Fetching ${API_BASE}${endpoint} with token:`, token ? "Present" : "Missing");

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: headers,
  });

   // 🔥 TOKEN EXPIRED / INVALID
  if (res.status === 401) {
    console.warn("Session expired. Logging out...");

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    window.location.href = "/login";
    return Promise.reject("Session expired");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Error ${res.status}: Request failed`);
  }

  return res.json();
}

