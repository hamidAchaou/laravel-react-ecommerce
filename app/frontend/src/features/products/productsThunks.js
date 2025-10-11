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
      // console.log("✅ API raw response:", response);
      // console.log("✅ API response.data:", response.data);
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
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("category_id", productData.category_id);
      formData.append("stock", productData.stock); // ✅ Send stock

      // Only append files
      productData.images.forEach((img) => {
        if (img.file) formData.append("images[]", img.file);
      });

      // Send primary image index
      const primaryIndex = productData.images.findIndex(
        (img) => img.is_primary
      );
      formData.append("primary_image_index", primaryIndex);

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
      const formData = new FormData();

      if (data.title) formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.price !== undefined) formData.append("price", data.price);
      if (data.category_id) formData.append("category_id", data.category_id);
      if (data.stock !== undefined) formData.append("stock", data.stock);

      // Images
      if (data.images?.length) {
        data.images.forEach((img) => {
          if (img.file) formData.append("images[]", img.file);
        });
        const primaryIndex = data.images.findIndex((img) => img.is_primary);
        formData.append("primary_image_index", primaryIndex);
      }

      const response = await api.post(
        `/api/products/${id}?_method=PUT`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

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
