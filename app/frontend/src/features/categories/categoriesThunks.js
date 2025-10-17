// categoriesThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/**
 * ✅ Fetch all categories
 */
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/categories");
      console.log("✅ Fetched categories:", data);
      
      if (!data?.data) throw new Error("Invalid API response");
      return data.data;
    } catch (error) {
      console.error("❌ Fetch categories error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch categories"
      );
    }
  }
);

/**
 * ✅ Create new category
 */
export const createCategory = createAsyncThunk(
  "categories/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/categories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data.data;
    } catch (error) {
      console.error("❌ Create category error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to create category"
      );
    }
  }
);

/**
 * ✅ Update existing category - FIXED to use POST with _method
 */
export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, data: formData }, { rejectWithValue }) => {
    try {
      // Add _method field for Laravel to recognize it as PUT request
      formData.append("_method", "PUT");
      
      const { data } = await api.post(`/api/categories/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data.data;
    } catch (error) {
      console.error("❌ Update category error:", error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.errors || 
        error.message || 
        "Failed to update category"
      );
    }
  }
);

/**
 * ✅ Delete category
 */
export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/categories/${id}`);
      return id;
    } catch (error) {
      console.error("❌ Delete category error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to delete category"
      );
    }
  }
);