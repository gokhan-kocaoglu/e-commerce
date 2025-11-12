// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, logoutApi } from "../services/authService";
import { saveAuth, readAuth, clearAuth } from "../utils/authStorage";

/**
 * LOGIN
 * payload: { email, password, remember }
 * response: { accessToken, refreshToken, expiresAt, user }
 */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password, remember }, { signal, rejectWithValue }) => {
    try {
      const data = await loginApi({ email, password, signal });
      saveAuth(data, remember); // persist tokens+user
      return data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || { message: "Login failed" }
      );
    }
  }
);

/**
 * LOGOUT (server + client)
 * Calls BE endpoint with refreshToken (handled in service), then clears client.
 */
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return true;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || { message: "Logout failed" }
      );
    }
  }
);

const initial = (() => {
  const { accessToken, user, expiresAt } = readAuth();
  return {
    status: "idle", // idle | loading | succeeded | failed
    user: user || null,
    accessToken: accessToken || null,
    expiresAt: expiresAt || null,
    error: null,
    isAuthenticated: !!accessToken,
  };
})();

const authSlice = createSlice({
  name: "auth",
  initialState: initial,
  reducers: {
    /**
     * Optional sync logout (e.g., forced sign-out)
     */
    logout(state) {
      clearAuth();
      state.user = null;
      state.accessToken = null;
      state.expiresAt = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
    /**
     * Optional: update user profile in-place (after /account/profile PUT)
     */
    setUser(state, action) {
      state.user = action.payload || null;
    },
  },
  extraReducers: (b) => {
    // LOGIN
    b.addCase(loginThunk.pending, (s) => {
      s.status = "loading";
      s.error = null;
    });
    b.addCase(loginThunk.fulfilled, (s, a) => {
      s.status = "succeeded";
      s.user = a.payload.user;
      s.accessToken = a.payload.accessToken;
      s.expiresAt = a.payload.expiresAt;
      s.isAuthenticated = true;
      s.error = null;
    });
    b.addCase(loginThunk.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload?.message || "Login failed";
      s.isAuthenticated = false;
      s.user = null;
      s.accessToken = null;
      s.expiresAt = null;
    });

    // LOGOUT (THUNK) – clear even if server returns error
    b.addCase(logoutThunk.pending, (s) => {
      s.status = "loading";
    });
    b.addCase(logoutThunk.fulfilled, (s) => {
      clearAuth();
      s.user = null;
      s.accessToken = null;
      s.expiresAt = null;
      s.isAuthenticated = false;
      s.status = "idle";
      s.error = null;
    });
    b.addCase(logoutThunk.rejected, (s) => {
      clearAuth();
      s.user = null;
      s.accessToken = null;
      s.expiresAt = null;
      s.isAuthenticated = false;
      s.status = "idle";
      s.error = null;
    });
  },
});

export const { logout, setUser } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => !!state.auth?.isAuthenticated;
export default authSlice.reducer;
