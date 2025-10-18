// src/features/users/usersThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/users");

      // Laravel ResourceCollection returns { data, meta, links }
      const usersList = data.data || data;
      
      if (!Array.isArray(usersList)) {
        throw new Error("Invalid API response format");
      }

      return {
        items: usersList.map((user) => ({
          id: user.id,
          name: user.name || "—",
          email: user.email || "—",
          phone: user.phone || "—",
          role: user.role || "user",
          status: user.status || "active",
          avatar: user.avatar || null,
          created_at: user.created_at,
          updated_at: user.updated_at,
        })),
        meta: data.meta || {},
        links: data.links || {},
      };
    } catch (error) {
      console.error("Fetch users error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch users"
      );
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/users/${userId}`);
      return data.data || data;
    } catch (error) {
      console.error("Fetch user error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch user"
      );
    }
  }
);

export const createUser = createAsyncThunk(
  "users/create",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/users", userData);
      return data.data || data;
    } catch (error) {
      console.error("Create user error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to create user"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/users/${userId}`, userData);
      return data.data || data;
    } catch (error) {
      console.error("Update user error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update user"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      return userId;
    } catch (error) {
      console.error("Delete user error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to delete user"
      );
    }
  }
);