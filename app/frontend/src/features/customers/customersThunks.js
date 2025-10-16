import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/*
 * fetch all customers
* */
export const fetchCustomers = createAsyncThunk(
    'customers/fetchAll',
    async (_, {rejectWithValue}) => {
        try {
            const {data} = await api.get('/api/customers');

            // Laravel API: { data: [...] }
            if (!data?.data) throw new Error('Invalid API response');

            return data.data.map(customer => ({
                id: customer.id,
                name: customer.name || '—',
                email: customer.email || '—',
                phone: customer.phone || '—',
                total_orders: customer.total_orders ?? 0,
                total_spent: parseFloat(customer.total_spent ?? 0),
                created_at: customer.created_at,
            }));
        } catch (error) {
            console.error('❌ Fetch customers error:', error);
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch customers'
            );
        }
    }
)