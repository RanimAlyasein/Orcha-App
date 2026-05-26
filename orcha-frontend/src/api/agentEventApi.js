// Fetches events sent by a specific agent, and sends simulated test events
import client from './client';

export const agentEventApi = {
  getForAgent: (agentId, page = 1) => client.get(`/agents/${agentId}/events`, { params: { page } }),
  simulate: (data) => client.post('/demo/simulate-event', data),
};
