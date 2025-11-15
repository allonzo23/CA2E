import axios from "axios";
import { getTabId } from "../utils/tabId";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ✅ Interceptor pour token spécifique à l'onglet
api.interceptors.request.use((config) => {
  const tabId = getTabId();
  const token = sessionStorage.getItem(`token_${tabId}`);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
