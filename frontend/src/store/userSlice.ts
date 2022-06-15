import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        balance: "0",
        wallet: "",
        isConnected: false,
    },
    reducers: {
        UPDATE_BALANCE: (state, action) => {
            state.balance = action.payload
        },
        UPDATE_WALLET: (state, action) => {
            state.wallet = action.payload
        },
        UPDATE_IS_CONNECTED: (state, action) => {
            state.isConnected = action.payload
        },
        USER_RESET: (state) => {
            state.balance = "0"
            state.wallet = ""
            state.isConnected = false
        },
    },
})


export const { 
    UPDATE_BALANCE,
    UPDATE_IS_CONNECTED,
    UPDATE_WALLET,
    USER_RESET 
} = userSlice.actions;

export default userSlice.reducer;