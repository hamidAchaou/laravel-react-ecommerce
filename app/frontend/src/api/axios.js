import axios from "axios";
import Cookies from "js-cookie"; // install with: npm install js-cookie

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Attach CSRF token if available
  const token = Cookies.get("XSRF-TOKEN");
  if (token) {
    config.headers["X-XSRF-TOKEN"] = token;
  }
  return config;
});

export default api;
