// app/frontend/src/api/axios.js
import axios from "axios";
import Cookies from "js-cookie"; // npm install js-cookie

// ✅ Create axios instance
const api = axios.create({
  baseURL: "http://localhost:8000", // Laravel backend
  withCredentials: true, // Required for Sanctum
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach CSRF token to every request
api.interceptors.request.use((config) => {
  const csrfToken = Cookies.get("XSRF-TOKEN");
  if (csrfToken) {
    config.headers["X-XSRF-TOKEN"] = csrfToken;
  }
  return config;
});

// ✅ Optional: Global response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle 401 Unauthorized globally
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized: please login again.");
    }
    return Promise.reject(error);
  }
);

export default api;
