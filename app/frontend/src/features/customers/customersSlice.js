import {cretaeSlice} from '@reduxjs/toolkit';
import {fetchCustomers} from './customersThunks';

const initialState = {
    customers: [],
    status: 'idle',
    error: null
};

const customersSlice = cretaeSlice({
    name: 'customers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.customers = action.payload; // already cleaned array
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Unable to fetch customers';
            });
    }
})

export default customersSlice.reducer;
