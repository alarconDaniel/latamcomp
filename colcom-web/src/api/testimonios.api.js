import { apiRequest, toQuery } from './client.js';

export const testimoniosApi = {
  publicByCountry: (countrySlug) => apiRequest(`/testimonials/public/${countrySlug}`),
  getAll: (filters) => apiRequest(`/testimonials${toQuery(filters)}`),
  getById: (id) => apiRequest(`/testimonials/${id}`),
  create: (data) => apiRequest('/testimonials', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/testimonials/${id}`, { method: 'PUT', body: data }),
  remove: (id) => apiRequest(`/testimonials/${id}`, { method: 'DELETE' }),
};
