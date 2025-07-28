import { authService } from './authService';

export const notificationService = {
  getAllNotifications: () => authService.api.get('/notifications'),
  markAsRead: (id) => authService.api.put(`/notifications/${id}/read`),
  deleteNotification: (id) => authService.api.delete(`/notifications/${id}`),
  markAllAsRead: () => authService.api.put('/notifications/mark-all-read'),
};
