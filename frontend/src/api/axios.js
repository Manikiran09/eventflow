import axios from 'axios';

const stripTrailingSlash = (value) => (value || '').replace(/\/$/, '');

const ensureApiPath = (value) => {
  const normalized = stripTrailingSlash(value || '');
  if (!normalized) return '';
  return normalized.endsWith('/api') ? normalized : `${normalized}/api`;
};

const configuredApiUrl = stripTrailingSlash(import.meta.env.VITE_API_URL || '');
const configuredBackendUrl = stripTrailingSlash(import.meta.env.VITE_BACKEND_URL || '');
const apiBaseUrl = configuredApiUrl || ensureApiPath(configuredBackendUrl) || '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('eventflow_user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export default api;