import axios from 'axios';

const stripTrailingSlash = (value) => (value || '').replace(/\/$/, '');

const ensureApiPath = (value) => {
  const normalized = stripTrailingSlash(value || '');
  if (!normalized) return '';
  return normalized.endsWith('/api') ? normalized : `${normalized}/api`;
};

const configuredApiUrl = stripTrailingSlash(import.meta.env.VITE_API_URL || '');
const configuredBackendUrl = stripTrailingSlash(import.meta.env.VITE_BACKEND_URL || '');
const isBrowser = typeof window !== 'undefined';
const isLocalDevelopment = isBrowser && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
const apiBaseUrl = configuredApiUrl || ensureApiPath(configuredBackendUrl) || (isLocalDevelopment ? '/api' : '');

const api = axios.create({
  baseURL: apiBaseUrl,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  if (!config.baseURL) {
    throw new Error('API base URL is not configured. Set VITE_API_URL or VITE_BACKEND_URL in your deployment environment.');
  }
  const user = JSON.parse(localStorage.getItem('eventflow_user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export default api;