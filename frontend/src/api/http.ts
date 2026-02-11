import axios from "axios";
import { store } from "../app/store";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach Bearer token automatically
http.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers = config.headers ?? {};
  config.headers.Accept = "application/json";
  return config;
});
