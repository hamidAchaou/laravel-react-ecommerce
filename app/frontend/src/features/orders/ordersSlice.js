// src/features/orders/ordersSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchOrders, deleteOrderAsync, fetchOrderById, updateOrder } from "./ordersThunks";

const initialState = {
  byId: {},
  allIds: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.byId = {};
        state.allIds = [];
        action.payload.forEach((order) => {
          state.byId[order.id] = order;
          state.allIds.push(order.id);
        });
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Order
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentOrder = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.byId[action.payload.id] = action.payload;
        if (!state.allIds.includes(action.payload.id)) state.allIds.push(action.payload.id);
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Order
      .addCase(updateOrder.fulfilled, (state, action) => {
        const order = action.payload;
        state.byId[order.id] = order;
        if (state.currentOrder?.id === order.id) state.currentOrder = order;
      })

      // Delete Order
      .addCase(deleteOrderAsync.fulfilled, (state, action) => {
        const id = action.payload;
        delete state.byId[id];
        state.allIds = state.allIds.filter((oid) => oid !== id);
        if (state.currentOrder?.id === id) state.currentOrder = null;
      });
  },
});

export default ordersSlice.reducer;
