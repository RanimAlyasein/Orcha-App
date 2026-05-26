// Fetches all aggregated stats and chart data shown on the dashboard
import client from './client';

export const dashboardApi = {
  summary: () => client.get('/dashboard/summary'),
  tasksByStatus: () => client.get('/dashboard/tasks-by-status'),
  eventsByType: () => client.get('/dashboard/events-by-type'),
  agentsByChannel: () => client.get('/dashboard/agents-by-channel'),
  agentsByType: () => client.get('/dashboard/agents-by-type'),
  recentActivity: () => client.get('/dashboard/recent-activity'),
};
