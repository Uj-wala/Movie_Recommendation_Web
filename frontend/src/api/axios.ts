import axios from "axios";
import { API_BASE_URL } from "../config/env";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,

  headers: {
    "Content-Type":
      "application/json",
  },
});

/**
 * Adds token automatically
 */
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("access_token");

    if (token && config.headers) {
      config.headers.Authorization =`Bearer ${token}`;
    }

    return config;
  },

  (error: any) => {
    return Promise.reject(
      error
    );
  }
);


/**
 * Handle common errors
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("interceptor error",error)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        const response = await axios.post(
          "http://localhost:8000/auth/refresh",
          {
            refresh_token: refreshToken,
          }
        );

        const newAccessToken = response.data.access_token;

        localStorage.setItem(
          "access_token",
          newAccessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // localStorage.removeItem("access_token");
        // localStorage.removeItem("refresh_token");
        toast.error("Session Expired")
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    } else if (
      error.response?.status === 403 
    ) {
      console.log("Forbidden");
    }

    return Promise.reject(error);
  }
);

export default api;
