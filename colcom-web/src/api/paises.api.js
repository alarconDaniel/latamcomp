import { apiRequest } from './client.js';

export const paisesApi = {
  publicActive: () => apiRequest('/public/countries'),
  active: () => apiRequest('/countries/active'),
  all: () => apiRequest('/countries'),
  getById: (id) => apiRequest(`/countries/${id}`),
  update: (id, data) => apiRequest(`/countries/${id}`, { method: 'PUT', body: data }),
};
