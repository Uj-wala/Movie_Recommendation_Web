import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config/env";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Backend wraps success responses as {success, message, data}. Unwrap here
    // so callers keep reading r.data as the raw payload.
    const body = response.data;
    if (body && typeof body === "object" && "success" in body && "data" in body) {
      response.data = body.data;
    }
    return response;
  },
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh_token = localStorage.getItem("refresh_token");
        if (!refresh_token) throw new Error("no refresh token");
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refresh_token });
        // Raw axios call bypasses the unwrap interceptor above, so unwrap the envelope here.
        const tokens = res.data?.data ?? res.data;
        localStorage.setItem("access_token", tokens.access_token);
        localStorage.setItem("refresh_token", tokens.refresh_token);
        original.headers.Authorization = `Bearer ${tokens.access_token}`;
        return api(original);
      } catch (refreshError) {
        localStorage.clear();
        if (!location.pathname.startsWith("/login")) {
          toast.error("Session expired, please sign in again");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
