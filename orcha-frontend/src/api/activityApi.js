// Fetches activity logs and audit logs from the API
import client from './client';

export const activityApi = {
  getLogs: (page = 1, limit = 30) => client.get('/activity-logs', { params: { page, limit } }),
  getAuditLogs: (page = 1, limit = 30) => client.get('/audit-logs', { params: { page, limit } }),
};
