import axios from 'axios';

const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');
const apiBaseUrl = import.meta.env.VITE_API_URL || (backendUrl ? `${backendUrl}/api` : '/api');

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