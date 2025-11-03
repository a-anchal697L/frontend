import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/auth/authApi";
import { taskApi } from "./features/tasks/taskApi";
import themeReducer from "./features/theme/themeSlice";
import authReducer from "./features/auth/authSlice";
// import taskReducer from "./features/tasks/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    // tasks: taskReducer,
    [authApi.reducerPath]: authApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(taskApi.middleware),
  devTools: import.meta.env.MODE !== "production", // enable devtools only in dev
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
