import axios from "axios";
import { useAuthStore } from "./auth";

const baseURL = process.env.NEXT_PUBLIC_API_BASE;
export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Token ${token}`;
    }
  }
  return config;
});