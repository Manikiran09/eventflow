import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('eventflow_user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export default api;