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
      const { data } = await api.get("/api/products");
      return data;
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
      const { data } = await api.get(`/api/products/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

/**
 * Create a new product
 */
export const createProduct = createAsyncThunk(
  "products/create",
  async (productData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Required fields - append as proper types
      formData.append("title", String(productData.title));
      formData.append("price", Number(productData.price).toString());
      formData.append("stock", Number(productData.stock).toString());
      formData.append("category_id", Number(productData.category_id).toString());
      
      if (productData.description) {
        formData.append("description", String(productData.description));
      }

      // Images
      if (productData.images?.length > 0) {
        const newFiles = productData.images.filter((img) => img.file);
        
        newFiles.forEach((img) => {
          formData.append("images[]", img.file);
        });

        // Determine which image is primary
        const primaryIndex = productData.images.findIndex((img) => img.is_primary && img.file);
        if (primaryIndex >= 0) {
          formData.append("primary_new_index", primaryIndex.toString());
        }
      }

      const { data } = await api.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    } catch (error) {
      // console.error("❌ Create product error:", error.response?.data || error);
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

      // Basic fields
      if (data.title) formData.append("title", String(data.title));
      if (data.description) formData.append("description", String(data.description));
      if (data.price !== undefined) formData.append("price", Number(data.price).toString());
      if (data.stock !== undefined) formData.append("stock", Number(data.stock).toString());
      if (data.category_id) formData.append("category_id", Number(data.category_id).toString());

      // Handle images
      if (data.images?.length) {
        const existingIds = data.images.filter((img) => img.id).map((img) => img.id);
        const newFiles = data.images.filter((img) => img.file);

        existingIds.forEach((imgId) => formData.append("existing_image_ids[]", imgId.toString()));
        newFiles.forEach((img) => formData.append("images[]", img.file));

        // Primary image
        const primaryExisting = data.images.find((img) => img.is_primary && img.id);
        const primaryNewIndex = data.images.findIndex((img) => img.is_primary && img.file);

        if (primaryExisting) {
          formData.append("primary_image_id", primaryExisting.id.toString());
        } else if (primaryNewIndex >= 0) {
          formData.append("primary_new_index", primaryNewIndex.toString());
        }
      }

      // Laravel expects PUT method spoofing
      const { data: res } = await api.post(`/api/products/${id}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res;
    } catch (error) {
      console.error("❌ Update product error:", error.response?.data || error);
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
      return id;
    } catch (error) {
      console.error("❌ Delete product error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);