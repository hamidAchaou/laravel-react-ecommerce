// src/features/permissions/permissionsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { 
  fetchPermissions, 
  fetchGroupedPermissions,
  createPermission,
  updatePermission,
  deletePermission
} from "./permissionsThunks";

const initialState = {
  items: [],
  grouped: {},
  pagination: {
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1
  },
  loading: false,
  error: null,
  operationLoading: false,
  operationError: null,
};

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.operationError = null;
    },
    clearPermissions: (state) => {
      state.items = [];
      state.grouped = {};
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Permissions
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination = {
          current_page: action.payload.meta?.current_page || 1,
          per_page: action.payload.meta?.per_page || 15,
          total: action.payload.meta?.total || 0,
          last_page: action.payload.meta?.last_page || 1
        };
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Grouped Permissions
      .addCase(fetchGroupedPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupedPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.grouped = action.payload.data || {};
      })
      .addCase(fetchGroupedPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Permission
      .addCase(createPermission.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        state.operationLoading = false;
        // Add new permission to the list
        state.items.unshift(action.payload.data);
      })
      .addCase(createPermission.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // Update Permission
      .addCase(updatePermission.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(updatePermission.fulfilled, (state, action) => {
        state.operationLoading = false;
        const updatedPermission = action.payload.data;
        const index = state.items.findIndex(item => item.id === updatedPermission.id);
        if (index !== -1) {
          state.items[index] = updatedPermission;
        }
      })
      .addCase(updatePermission.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      // Delete Permission
      .addCase(deletePermission.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      });
  },
});

export const { clearError, clearPermissions, setPagination } = permissionsSlice.actions;
export default permissionsSlice.reducer;