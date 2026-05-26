// Handles API calls for team management — list members, invite, update roles, and remove
import client from './client';

export const teamApi = {
  getMembers: () => client.get('/team'),
  invite: (email, role) => client.post('/invitations', { email, role }),
  getInvitation: (token) => client.get(`/invitations/${token}`),
  acceptInvitation: (token, name, password) =>
    client.post('/invitations/accept', { token, name, password }),
  updateRole: (memberId, role) => client.patch(`/team/${memberId}/role`, { role }),
  removeMember: (memberId) => client.delete(`/team/${memberId}`),
};
