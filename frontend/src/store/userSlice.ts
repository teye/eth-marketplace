import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        wallet: "",
        isConnected: false,
    },
    reducers: {
        UPDATE_WALLET: (state, action) => {
            state.wallet = action.payload
        },
        UPDATE_IS_CONNECTED: (state, action) => {
            state.isConnected = action.payload
        },
    },
})


export const { 
    UPDATE_IS_CONNECTED,
    UPDATE_WALLET 
} = userSlice.actions;

export default userSlice.reducer;