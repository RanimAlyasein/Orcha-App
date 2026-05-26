// ─── Axios HTTP Client ─────────────────────────────────────────────────────────
// A single configured axios instance shared by all API modules (authApi, agentApi, etc.).
// Using one instance means auth headers and error handling are set up in one place
// and apply automatically to every request in the app.
// ──────────────────────────────────────────────────────────────────────────────

import axios from 'axios';

// baseURL is relative so requests go to the same origin as the frontend.
// In development, Vite proxies /api/ to the local backend (port 3010).
// In production, nginx proxies /api/ to the backend container.
const client = axios.create({ baseURL: '/api/v1' });

// ── Request interceptor ───────────────────────────────────────────────────────
// Runs before every request is sent. Automatically attaches the JWT token from
// localStorage to the Authorization header so the user doesn't have to pass it
// manually in every API call.
client.interceptors.request.use(config => {
  const token = localStorage.getItem('orcha_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────
// Runs after every response. Handles 401 Unauthorized globally:
// if the server says the token is invalid or expired, clear it from storage
// and redirect to the login page — the user must log in again.
client.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('orcha_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default client;
