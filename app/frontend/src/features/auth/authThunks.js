import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// Ensure CSRF Token before requests
const ensureCsrfToken = async () => {
  await api.get("/sanctum/csrf-cookie");
};

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      await ensureCsrfToken();
      const res = await api.get("/api/user");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch user");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await ensureCsrfToken();
      const res = await api.post("/login", { email, password });
      return res.data; // { user, token }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password, password_confirmation }, { rejectWithValue }) => {
    try {
      await ensureCsrfToken();
      const res = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation,
      });
      return res.data; // { user, token }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/logout");
      return true;
    } catch (err) {
      return rejectWithValue("Logout failed");
    }
  }
);
