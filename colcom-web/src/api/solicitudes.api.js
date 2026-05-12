import { apiRequest, toQuery } from './client.js';

export const solicitudesApi = {
  createPublic: (data) => apiRequest('/contact-requests/public', { method: 'POST', body: data }),
  getAll: (filters) => apiRequest(`/contact-requests${toQuery(filters)}`),
  getById: (id) => apiRequest(`/contact-requests/${id}`),
  updateStatus: (id, data) => apiRequest(`/contact-requests/${id}/status`, { method: 'PUT', body: data }),
  remove: (id) => apiRequest(`/contact-requests/${id}`, { method: 'DELETE' }),
};
