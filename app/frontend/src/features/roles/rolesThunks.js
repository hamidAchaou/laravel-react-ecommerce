// src/features/roles/rolesThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/**
 * Fetch all roles
 */
export const fetchRoles = createAsyncThunk(
  "roles/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/roles");
      console.log("Fetched roles data:", data);
      
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch roles"
      );
    }
  }
);

/**
 * Fetch single role
 */
export const fetchRoleById = createAsyncThunk(
  "roles/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/roles/${id}`);
      console.log(data);
      
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch role"
      );
    }
  }
);

/**
 * Create a new role
 */
export const createRole = createAsyncThunk(
  "roles/create",
  async (roleData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/roles", roleData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create role"
      );
    }
  }
);

/**
 * Update a role
 */
export const updateRole = createAsyncThunk(
  "roles/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const { data: res } = await api.put(`/api/roles/${id}`, data);
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update role"
      );
    }
  }
);

/**
 * Delete a role
 */
export const deleteRole = createAsyncThunk(
  "roles/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/roles/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete role"
      );
    }
  }
);
