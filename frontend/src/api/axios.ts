import axios from "axios";
import { API_BASE_URL } from "../config/env";

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
api.interceptors.response.use((response: any) => response,
 async (error: any) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized");
      // logout or refresh token logic here
    } else if (error.response?.status === 403) {
      console.log("Forbidden");
    }

    return Promise.reject(
      error
    );
  }
);

export default api;
