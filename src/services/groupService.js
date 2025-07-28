import { authService } from './authService';

export const groupService = {
  getAllGroups: () => authService.api.get('/groups'),
  createGroup: (groupData) => authService.api.post('/groups', groupData),
  getGroup: (id) => authService.api.get(`/groups/${id}`),
  updateGroup: (id, groupData) => authService.api.put(`/groups/${id}`, groupData),
  deleteGroup: (id) => authService.api.delete(`/groups/${id}`),
  addMember: (groupId, userId) => authService.api.post(`/groups/${groupId}/members`, { userId }),
  removeMember: (groupId, userId) => authService.api.delete(`/groups/${groupId}/members/${userId}`),
};
