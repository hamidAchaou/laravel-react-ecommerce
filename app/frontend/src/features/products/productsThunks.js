// src/features/products/productsThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/**
 * Fetch all products
 */
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/products");
      console.log("✅ API raw response:", response);
      console.log("✅ API response.data:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Fetch products error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

/**
 * Fetch single product by ID
 */
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

/**
 * Create new product
 */
export const createProduct = createAsyncThunk(
  "products/create",
  async (productData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", productData.title);
      formData.append("description", productData.description);ProductStoreRequest
      formData.append("price", productData.price);
      formData.append("category_id", productData.category_id);

      // Append each image
      productData.images.forEach((img, index) => {
        formData.append(`images[${index}]`, img.file); // ✅ Laravel will read images[] as an array
        formData.append(`is_primary[${index}]`, img.is_primary ? 1 : 0);
      });

      const response = await api.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);


/**
 * Update existing product
 */
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/products/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

/**
 * Delete product
 */
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/products/${id}`);
      return id; // Return the deleted ID
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);
