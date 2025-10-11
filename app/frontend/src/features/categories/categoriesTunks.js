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
      // Laravel API structure: { data: [...] }
      if (!data?.data) throw new Error("Invalid API response");
      return data.data; // return only the array of categories
    } catch (error) {
      console.error("❌ Fetch categories error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch categories"
      );
    }
  }
);
