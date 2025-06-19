import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";

const initialState = null;

export const loginUser = createAsyncThunk("user/loginUser", async (user) => {
  const addedUser = await loginService.login(user);
  return addedUser;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userAdded: (state, action) => {
      return action.payload;
    },
    userRemoved: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const { userAdded, userRemoved } = userSlice.actions;

export default userSlice.reducer;

export const getUser = (state) => state.user;
