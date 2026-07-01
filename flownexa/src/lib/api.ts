const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

interface RequestOptions extends RequestInit {
  bodyData?: unknown;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_URL}${path}`;

  // Build headers
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Attach token from localStorage
  const storeData = localStorage.getItem("flownexa-auth-store");
  if (storeData) {
    try {
      const parsed = JSON.parse(storeData);
      const token = parsed?.state?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch {
      // Ignored
    }
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.bodyData) {
    config.body = JSON.stringify(options.bodyData);
  }

  const response = await fetch(url, config);

  // Handle unauthorized (expired token)
  if (response.status === 401) {
    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
      localStorage.removeItem("flownexa-auth-store");
      window.location.href = "/login";
    }
  }

  const result = await response.json();

  if (!response.ok) {
    let errorMsg = (result && typeof result === "object" && "message" in result && typeof result.message === "string")
      ? result.message
      : "Something went wrong";

    if (result && typeof result === "object" && Array.isArray(result.errors) && result.errors.length > 0) {
      const details = result.errors.map((e: any) => `${e.field}: ${e.message}`).join(", ");
      errorMsg += ` (${details})`;
    }
    throw new Error(errorMsg);
  }

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
