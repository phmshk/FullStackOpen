import { createSlice } from "@reduxjs/toolkit";

const notificationReducer = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    setNotification: (state, action) => {
      return action.payload;
    },
  },
});

export const setNotificationWithTimeout = (message, seconds) => {
  return async (dispatch) => {
    dispatch(setNotification(message));

    setTimeout(() => {
      dispatch(setNotification(null));
    }, 1000 * seconds);
  };
};

export const { setNotification } = notificationReducer.actions;
export default notificationReducer.reducer;
