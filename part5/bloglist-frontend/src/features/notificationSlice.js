import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  text: "",
  type: null,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    notificationAdded: (state, action) => {
      return action.payload;
    },
    notificationRemoved: () => {
      return initialState;
    },
  },
});

export const { notificationAdded, notificationRemoved } =
  notificationSlice.actions;

export default notificationSlice.reducer;

export const selectNotification = (state) => state.notification;
