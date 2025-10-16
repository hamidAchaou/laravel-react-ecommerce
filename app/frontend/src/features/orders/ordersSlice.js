// src/features/orders/ordersSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchOrders, deleteOrderAsync } from "./ordersThunks";

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOrderAsync.fulfilled, (state, action) => {
        state.orders = state.orders.filter((order) => order.id !== action.payload);
      });
  },
});

export default ordersSlice.reducer;
