import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

/**
 * Fetch all customers (paginated or not)
 */
export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/clients');

      if (!data?.data) throw new Error('Invalid API response format');

      return data.data.map((client) => ({
        id: client.id,
        name: client.user?.name || '—',
        email: client.user?.email || '—',
        phone: client.phone || '—',
        address: client.full_address || '',
        country: client.country?.name || '—',
        city: client.city?.name || '—',
        created_at: client.created_at,
      }));
    } catch (error) {
      console.error('❌ Fetch customers error:', error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch customers'
      );
    }
  }
);
