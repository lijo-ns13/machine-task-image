import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface AuthState {
  isAuthenticated: boolean;
  id: string | null;
  name: string | null;
  email: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  id: null,
  name: null,
  email: null,
};

interface LoginPayload {
  id: string;
  name: string;
  email: string;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state: AuthState, action: PayloadAction<LoginPayload>) => {
      state.isAuthenticated = true;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    logout: () => initialState,
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
