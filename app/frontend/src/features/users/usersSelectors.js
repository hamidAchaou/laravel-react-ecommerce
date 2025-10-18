// src/features/users/usersSelectors.js
import { createSelector } from '@reduxjs/toolkit';

// Base selector
export const selectUsersState = (state) => state.users;

// Memoized selectors for optimal performance
export const selectAllUsers = createSelector(
  [selectUsersState],
  (usersState) => usersState.items || []
);

export const selectUsersLoading = createSelector(
  [selectUsersState],
  (usersState) => usersState.status === 'loading'
);

export const selectUsersError = createSelector(
  [selectUsersState],
  (usersState) => usersState.error
);

export const selectUsersStatus = createSelector(
  [selectUsersState],
  (usersState) => usersState.status
);

export const selectUsersPagination = createSelector(
  [selectUsersState],
  (usersState) => usersState.pagination || {}
);

export const selectUserById = createSelector(
  [selectAllUsers, (state, userId) => userId],
  (users, userId) => users.find(user => user.id === userId)
);

// Filtered users selector
export const selectUsersByRole = createSelector(
  [selectAllUsers, (state, role) => role],
  (users, role) => {
    if (!role || role === 'all') return users;
    return users.filter(user => user.role === role);
  }
);

// Search users selector
export const selectUsersBySearch = createSelector(
  [selectAllUsers, (state, searchTerm) => searchTerm],
  (users, searchTerm) => {
    if (!searchTerm) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.phone?.toLowerCase().includes(term)
    );
  }
);

// Stats selectors
export const selectUsersStats = createSelector(
  [selectAllUsers],
  (users) => ({
    total: users.length,
    active: users.filter(user => user.status === 'active' || !user.status).length,
    admins: users.filter(user => user.role === 'admin').length,
    customers: users.filter(user => user.role === 'customer' || user.role === 'user').length,
  })
);