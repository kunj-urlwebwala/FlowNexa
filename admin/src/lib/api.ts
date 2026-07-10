const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

interface RequestOptions extends RequestInit {
  bodyData?: unknown;
}

function getStoreState() {
  const storeData = localStorage.getItem("flownexa-admin-store");
  if (!storeData) return null;
  try {
    return JSON.parse(storeData)?.state || null;
  } catch {
    return null;
  }
}

async function refreshAccessToken(): Promise<{ accessToken: string; refreshToken: string } | null> {
  const state = getStoreState();
  const refreshToken = state?.refreshToken;
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

function saveTokens(accessToken: string, refreshToken: string) {
  const storeData = localStorage.getItem("flownexa-admin-store");
  if (!storeData) return;
  try {
    const parsed = JSON.parse(storeData);
    parsed.state.token = accessToken;
    parsed.state.refreshToken = refreshToken;
    localStorage.setItem("flownexa-admin-store", JSON.stringify(parsed));
  } catch {
    // Ignored
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_URL}${path}`;

  // Build headers
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Attach token from localStorage
  const state = getStoreState();
  if (state?.token) {
    headers.set("Authorization", `Bearer ${state.token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.bodyData) {
    config.body = JSON.stringify(options.bodyData);
  }

  let response = await fetch(url, config);

  // Handle unauthorized (expired token) — try to refresh
  if (response.status === 401 && !path.includes("/auth/")) {
    const tokens = await refreshAccessToken();
    if (tokens) {
      saveTokens(tokens.accessToken, tokens.refreshToken);
      headers.set("Authorization", `Bearer ${tokens.accessToken}`);
      config.headers = headers;
      response = await fetch(url, config);
    }
  }

  // If still unauthorized after refresh, redirect to login
  if (response.status === 401) {
    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
      localStorage.removeItem("flownexa-admin-store");
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }

  const result = await response.json();

  if (!response.ok) {
    let errorMsg = (result && typeof result === "object" && "message" in result && typeof result.message === "string")
      ? result.message
      : "Something went wrong";

    if (result && typeof result === "object" && Array.isArray(result.errors) && result.errors.length > 0) {
      const details = result.errors.map((e: { field: string; message: string }) => `${e.field}: ${e.message}`).join(", ");
      errorMsg += ` (${details})`;
    }
    throw new Error(errorMsg);
  }

  // standard envelope is { success: true, message: "...", data: T, meta: ... }
  return result.data as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", bodyData: body }),
  
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", bodyData: body }),
  
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", bodyData: body }),
  
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
