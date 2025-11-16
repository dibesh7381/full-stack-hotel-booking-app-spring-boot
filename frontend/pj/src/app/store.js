import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import roomFormReducer from "../features/roomFormSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    roomForm: roomFormReducer,  // ⭐ Add this
  },

  middleware: (getDefault) =>
    getDefault().concat(authApi.middleware),
});
