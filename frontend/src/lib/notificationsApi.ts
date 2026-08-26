import { api } from './api';

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: 'Interview Scheduled',
    message: 'FinTech Payment Systems invited you for a Technical Architecture Round for Senior Java Tech Lead.',
    read: false,
    createdAt: '10 minutes ago',
  },
  {
    id: 2,
    title: 'Job Offer Received!',
    message: 'Nexus Cloud Infrastructure sent you a formal offer for Spring Boot Architect (₹28 LPA).',
    read: false,
    createdAt: '2 hours ago',
  },
  {
    id: 3,
    title: 'Resume ATS Score Bumped',
    message: 'Your resume score increased to 89/100 after adding Java 21 Virtual Threads keywords.',
    read: true,
    createdAt: '1 day ago',
  },
];

export const notificationsApi = {
  async list(): Promise<{ data: NotificationItem[] }> {
    try {
      const res = await api.get<NotificationItem[]>('/api/notifications');
      return res;
    } catch {
      return { data: MOCK_NOTIFICATIONS };
    }
  },

  async markRead(id: number): Promise<{ data: NotificationItem }> {
    try {
      const res = await api.patch<NotificationItem>(`/api/notifications/${id}/read`);
      return res;
    } catch {
      const notif = MOCK_NOTIFICATIONS.find((n) => n.id === id) || MOCK_NOTIFICATIONS[0];
      notif.read = true;
      return { data: notif };
    }
  },
};

