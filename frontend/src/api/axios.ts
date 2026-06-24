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
    return Promise.reject(
      error
    );
  }
);

export default api;
