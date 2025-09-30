import axios from "axios";

// Axios instance للـ API routes (اللي كيمشيو عبر /api)
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  withCredentials: true,
});

// Axios instance خاص بالـ Sanctum (csrf-cookie, login, logout)
export const sanctum = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
  withCredentials: true,
});
