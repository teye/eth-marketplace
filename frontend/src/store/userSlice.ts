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
        USER_RESET: (state) => {
            state.wallet = ""
            state.isConnected = false
        },
    },
})


export const { 
    UPDATE_IS_CONNECTED,
    UPDATE_WALLET,
    USER_RESET 
} = userSlice.actions;

export default userSlice.reducer;