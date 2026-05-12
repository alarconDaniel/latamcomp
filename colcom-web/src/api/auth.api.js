import { apiRequest } from './client.js';

export const authApi = {
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials }),
  me: () => apiRequest('/profile/me'),
  logout: (refreshToken) => apiRequest('/auth/logout', { method: 'POST', body: { refreshToken } }),
};
