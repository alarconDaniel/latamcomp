import { apiRequest, toQuery } from './client.js';

export const noticiasApi = {
  publicByCountry: (countrySlug) => apiRequest(`/news/public/${countrySlug}`),
  publicBySlug: (countrySlug, newsSlug) => apiRequest(`/news/public/${countrySlug}/${newsSlug}`),
  getAll: (filters) => apiRequest(`/news${toQuery(filters)}`),
  getById: (id) => apiRequest(`/news/${id}`),
  create: (data) => apiRequest('/news', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/news/${id}`, { method: 'PUT', body: data }),
  remove: (id) => apiRequest(`/news/${id}`, { method: 'DELETE' }),
};
