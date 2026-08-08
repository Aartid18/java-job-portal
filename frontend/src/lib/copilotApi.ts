import { api } from './api';

export interface ChatMessage {
  id?: number;
  sender: 'USER' | 'ASSISTANT';
  message: string;
  jobId?: number | null;
  actionLink?: string | null;
  actionLabel?: string | null;
  suggestedQuestions?: string[];
  createdAt?: string;
}

export interface CopilotChatResponse {
  message: string;
  sender: 'ASSISTANT';
  jobId?: number | null;
  actionLink?: string | null;
  actionLabel?: string | null;
  suggestedQuestions?: string[];
  timestamp?: string;
}

export const copilotApi = {
  chat(message: string, jobId?: number | null) {
    return api.post<CopilotChatResponse>('/api/copilot/chat', {
      message,
      jobId: jobId || null,
    });
  },

  getHistory() {
    return api.get<ChatMessage[]>('/api/copilot/history');
  },

  clearHistory() {
    return api.delete<{ message: string }>('/api/copilot/history');
  },
};
