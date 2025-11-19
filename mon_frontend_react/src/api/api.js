import axios from "axios";
import { getTabId } from "../utils/tabId";

const api = axios.create({
  baseURL: "http://185.229.224.232:3001/api", // IP publique du VPS
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
