import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import blockchainReducer from "./blockchainSlice";
import createSagaMiddleware from 'redux-saga';
import mySaga from "../sagas/mySaga";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        user: userReducer,
        blockchain: blockchainReducer
    },
    middleware: [sagaMiddleware]
});

sagaMiddleware.run(mySaga);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch