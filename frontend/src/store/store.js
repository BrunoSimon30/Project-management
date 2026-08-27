import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi.js";
import "./api/authApi.js";
import "./api/departmentApi.js";
import "./api/projectApi.js";
import "./api/usersApi.js";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
