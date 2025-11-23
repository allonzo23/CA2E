import axios from "axios";
import { getTabId } from "../utils/tabId";

// Détection automatique de l'environnement
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return '/api'; // Production : utilise le proxy Nginx
  }
  return 'http://localhost:3001/api'; // Dev local : backend direct
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ✅ Interceptor pour token spécifique à l'onglet
api.interceptors.request.use((config) => {
  const tabId = getTabId();
  const token = sessionStorage.getItem(`token_${tabId}`); // ✅ Corrigé : template literal
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Interceptor pour logger les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    console.error('❌ API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;


/*
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
*/
