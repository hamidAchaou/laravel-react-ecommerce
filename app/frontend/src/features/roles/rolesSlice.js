// src/features/roles/rolesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRoles,
  fetchRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "./rolesThunks";

const initialState = {
  items: [],
  currentRole: null,
  loading: false,
  error: null,
};

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRole: (state) => {
      state.currentRole = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single
      .addCase(fetchRoleById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRole = action.payload.data || action.payload;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createRole.fulfilled, (state, action) => {
        state.items.push(action.payload.data || action.payload);
      })

      // Update
      .addCase(updateRole.fulfilled, (state, action) => {
        const updated = action.payload.data || action.payload;
        const index = state.items.findIndex((r) => r.id === updated.id);
        if (index !== -1) state.items[index] = updated;
      })

      // Delete
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentRole } = rolesSlice.actions;
export default rolesSlice.reducer;
