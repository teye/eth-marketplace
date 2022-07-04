import { createSlice } from "@reduxjs/toolkit";

export const blockchainSlice = createSlice({
    name: 'blockchain',
    initialState: {},
    reducers: {
        APP_MOUNTED() {}
    }
});

export const {
    APP_MOUNTED
} = blockchainSlice.actions;

export default blockchainSlice.reducer;