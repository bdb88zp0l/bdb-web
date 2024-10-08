/**
 * The Redux slice for managing authentication state in the application.
 * 
 * This slice manages the following state:
 * - `token`: The authentication token, which may be retrieved from localStorage.
 * - `user`: The currently authenticated user.
 * - `loading`: A flag indicating whether an authentication operation is in progress.
 * - `error`: Any error that occurred during an authentication operation.
 * 
 * The slice provides the following actions:
 * - `loginStart`: Indicates that a login operation has started.
 * - `loginSuccess`: Updates the state with the successful login token.
 * - `loginFailure`: Updates the state with an error that occurred during login.
 * - `setUser`: Updates the state with the currently authenticated user.
 * - `logout`: Clears the authentication token and user from the state.
 */
// store/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token:
    typeof localStorage !== "undefined" ? localStorage?.getItem("token") : null,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.token = action.payload.token;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, setUser, logout } =
  authSlice.actions;
export default authSlice.reducer;
