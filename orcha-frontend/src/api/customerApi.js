// Fetches and manages customer/contact records from the API
import client from './client';

export const customerApi = {
  getAll: (page = 1, limit = 20) => client.get('/customers', { params: { page, limit } }),
  getOne: (id) => client.get(`/customers/${id}`),
  create: (data) => client.post('/customers', data),
  update: (id, data) => client.put(`/customers/${id}`, data),
  delete: (id) => client.delete(`/customers/${id}`),
};
