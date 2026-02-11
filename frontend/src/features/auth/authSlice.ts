import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http } from "../../api/http";
import type { AuthState, User } from "./authTypes";
import axios from "axios";

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: null,
  loading: false,
  error: null,
};

export type ApiError = { message?: string };


export const login = createAsyncThunk<
  { token: string; user: User },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (payload, thunkApi) => {
  try {
    const res = await http.post("/api/login", payload);
    return res.data;
  } catch (e: unknown) {
    if (axios.isAxiosError<ApiError>(e)) {
      return thunkApi.rejectWithValue(e.response?.data?.message ?? "Login failed");
    }
    return thunkApi.rejectWithValue("Login failed");
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await http.post("/api/logout");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.token = a.payload.token;
        s.user = a.payload.user;
        localStorage.setItem("token", a.payload.token);
      })
      .addCase(login.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? "Login failed";
      })
      .addCase(logout.fulfilled, (s) => {
        s.token = null;
        s.user = null;
        localStorage.removeItem("token");
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
