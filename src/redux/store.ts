import { configureStore } from "@reduxjs/toolkit";

import chessBoardReducer from "./chessBoard.slice";

export const store = configureStore({
  reducer: {
    chessBoard: chessBoardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
