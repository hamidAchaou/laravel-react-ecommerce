// src/features/permissions/permissionsThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/**
 * Fetch all permissions
 */
export const fetchPermissions = createAsyncThunk(
  "permissions/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/permissions", { params });
      console.log(data);
      
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch permissions"
      );
    }
  }
);

/**
 * Fetch permissions grouped by guard
 */
export const fetchGroupedPermissions = createAsyncThunk(
  "permissions/fetchGrouped",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/permissions-grouped");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch grouped permissions"
      );
    }
  }
);

/**
 * Create new permission
 */
export const createPermission = createAsyncThunk(
  "permissions/create",
  async (permissionData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/permissions", permissionData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create permission"
      );
    }
  }
);

/**
 * Update permission
 */
export const updatePermission = createAsyncThunk(
  "permissions/update",
  async ({ id, ...permissionData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/permissions/${id}`, permissionData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update permission"
      );
    }
  }
);

/**
 * Delete permission
 */
export const deletePermission = createAsyncThunk(
  "permissions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/permissions/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete permission"
      );
    }
  }
);