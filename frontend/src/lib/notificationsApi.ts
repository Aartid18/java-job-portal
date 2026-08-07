import { api } from './api';

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const notificationsApi = {
  list: () => api.get<NotificationItem[]>('/api/notifications'),
  markRead: (id: number) => api.patch<NotificationItem>(`/api/notifications/${id}/read`),
};
