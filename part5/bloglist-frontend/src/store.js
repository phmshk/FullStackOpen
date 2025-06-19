import { configureStore } from "@reduxjs/toolkit";
import notificationsReducer from "./features/notificationSlice";
import blogsReducer from "./features/blogsSlice";
import userReducer from "./features/userSlice";
import { listenerMiddleware } from "./listenerMiddleware";

export const store = configureStore({
  reducer: {
    notification: notificationsReducer,
    blogs: blogsReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});
