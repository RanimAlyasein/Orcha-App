// Handles all authentication API calls — login, register, password reset, and profile updates
import client from './client';

export const authApi = {
  register: (name, email, password, organizationName) =>
    client.post('/auth/register', { name, email, password, organizationName }),
  login: (email, password) => client.post('/auth/login', { email, password }),
  me: () => client.get('/auth/me'),
  logout: () => client.post('/auth/logout'),
  updateProfile: (name) => client.patch('/auth/me', { name }),
  changePassword: (currentPassword, newPassword) =>
    client.patch('/auth/me/password', { currentPassword, newPassword }),
  forgotPassword: (email) => client.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => client.post('/auth/reset-password', { token, password }),
  verifyEmail: (token) => client.post('/auth/verify-email', { token }),
  resendVerification: () => client.post('/auth/resend-verification'),
};
