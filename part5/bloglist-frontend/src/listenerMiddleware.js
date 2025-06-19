import { createListenerMiddleware } from "@reduxjs/toolkit";
import { loginUser } from "./features/userSlice";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: loginUser.fulfilled,
  effect: (action) => {
    localStorage.setItem("user", JSON.stringify(action.payload));
  },
});
