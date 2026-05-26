// Handles API calls for tasks — create, update status, and delete
import client from './client';

export const taskApi = {
  getAll: (page = 1, limit = 20, filters = {}) => client.get('/tasks', { params: { page, limit, ...filters } }),
  getOne: (id) => client.get(`/tasks/${id}`),
  create: (data) => client.post('/tasks', data),
  update: (id, data) => client.put(`/tasks/${id}`, data),
  updateStatus: (id, status) => client.patch(`/tasks/${id}/status`, { status }),
  delete: (id) => client.delete(`/tasks/${id}`),
};
