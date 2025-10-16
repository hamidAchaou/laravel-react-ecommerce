// src/features/orders/ordersThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/**
 * ✅ Fetch all orders
 */
export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/orders");

      // Laravel API: { data: [...] }
      if (!data?.data) throw new Error("Invalid API response");

      return data.data.map((order) => ({
        id: order.id,
        customer_name: order.client?.name || "—",
        email: order.client?.email || "—",
        items_count: order.total_items ?? 0,
        total: parseFloat(order.total_amount ?? 0),
        status: order.status || "Unknown",
        status_color: order.status_color || "default",
        created_at: order.created_at,
      }));
    } catch (error) {
      console.error("❌ Fetch orders error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch orders"
      );
    }
  }
);

/**
 * ✅ Delete order
 */
export const deleteOrderAsync = createAsyncThunk(
  "orders/delete",
  async (orderId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/orders/${orderId}`);
      return orderId;
    } catch (error) {
      console.error("❌ Delete order error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to delete order"
      );
    }
  }
);

/**
 * ✅ Fetch single order by ID — Clean & Optimized
 */
export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data: order } = await api.get(`/api/orders/${id}`);

      if (!order) throw new Error("Invalid API response");

      return {
        id: order.id,
        customer_name: order.client?.name ?? "—",
        email: order.client?.email ?? "—",
        items_count: order.total_items ?? 0,
        total: Number(order.total_amount ?? 0),
        status: order.status ?? "Unknown",
        status_color: order.status_color ?? "default",
        created_at: order.created_at,
        items: order.order_items?.map((item) => ({
          id: item.id,
          name: item.product?.title ?? `Product #${item.product?.id}`,
          quantity: item.quantity,
          price: Number(item.price),
          image:
            item.images?.find((img) => img.is_primary)?.image_path ||
            item.images?.[0]?.image_path ||
            null,
        })) ?? [],
      };
    } catch (error) {
      console.error("❌ Fetch order by ID error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch order"
      );
    }
  }
);

