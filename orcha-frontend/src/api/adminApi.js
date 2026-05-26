// Fetches and manages all users and organizations — only accessible by System Admins
import client from './client';

export const adminApi = {
  getUsers: (page = 1) => client.get('/admin/users', { params: { page } }),
  updateUserStatus: (id, status) => client.patch(`/admin/users/${id}/status`, { status }),
  getOrgs: (page = 1) => client.get('/organizations', { params: { page } }),
  updateOrgStatus: (id, isActive) => client.patch(`/organizations/${id}/status`, { isActive }),
};
