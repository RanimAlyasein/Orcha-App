// Handles all API calls for AI agents — create, read, update, delete, and fetch their tasks/events
import client from './client';

export const agentApi = {
  getAll: (page = 1, limit = 20, params = {}) => client.get('/agents', { params: { page, limit, ...params } }),
  getOne: (id) => client.get(`/agents/${id}`),
  create: (data) => client.post('/agents', data),
  update: (id, data) => client.put(`/agents/${id}`, data),
  delete: (id) => client.delete(`/agents/${id}`),
  getTasks: (id, page = 1) => client.get(`/agents/${id}/tasks`, { params: { page } }),
  getLogs: (id, page = 1) => client.get(`/agents/${id}/logs`, { params: { page } }),
  getEvents: (id, page = 1) => client.get(`/agents/${id}/events`, { params: { page } }),
  getIntegration: (id) => client.get(`/agents/${id}/integration`),
};
