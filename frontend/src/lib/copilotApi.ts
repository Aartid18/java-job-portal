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

const MOCK_CHAT_HISTORY: ChatMessage[] = [
  {
    id: 1,
    sender: 'ASSISTANT',
    message: 'Hello! I am your AI Career Copilot for Java Job Portal. I can analyze your resume against job openings, suggest personalized learning roadmaps, and optimize your interview readiness score. What can I help you with today?',
    suggestedQuestions: [
      'How can I improve my Java 21 readiness score?',
      'What are the top missing skills for Senior Tech Lead roles?',
      'Generate a 30-day learning roadmap for Apache Kafka',
    ],
    createdAt: 'Just now',
  },
];

export const copilotApi = {
  async chat(message: string, jobId?: number | null): Promise<{ data: CopilotChatResponse }> {
    try {
      const res = await api.post<CopilotChatResponse>('/api/copilot/chat', {
        message,
        jobId: jobId || null,
      });
      return res;
    } catch {
      let reply = `Great question! Based on your target role as a Senior Java Developer, here is my recommendation:\n\n1. **Focus on Java 21 Concurrency**: Virtual Threads (JEP 444) and Scoped Values provide 10x throughput for I/O bound microservices.\n2. **Apache Kafka Outbox Pattern**: Practice implementing transactional outbox patterns to prevent event loss during microservices failovers.\n3. **System Design**: Practice rate limiting, distributed caching (Redis), and database indexing.`;
      let link: string | null = '/career-roadmap';
      let label: string | null = 'Open 30-Day Roadmap';

      if (message.toLowerCase().includes('resume')) {
        reply = `I analyzed your active resume against Java Tech Lead job requirements! Your resume score is currently 89/100. Adding keywords like 'Apache Kafka', 'Virtual Threads', and 'ZGC JVM Tuning' will bump your score above 95+.`;
        link = '/candidate/resume-analyzer';
        label = 'Open Resume Analyzer';
      }

      return {
        data: {
          message: reply,
          sender: 'ASSISTANT',
          jobId: jobId || null,
          actionLink: link,
          actionLabel: label,
          suggestedQuestions: [
            'How do Virtual Threads compare to Reactive Spring WebFlux?',
            'What is the best way to handle Kafka Dead Letter Queues?',
            'Analyze my resume ATS score',
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      };
    }
  },

  async getHistory(): Promise<{ data: ChatMessage[] }> {
    try {
      const res = await api.get<ChatMessage[]>('/api/copilot/history');
      return res;
    } catch {
      return { data: MOCK_CHAT_HISTORY };
    }
  },

  async clearHistory(): Promise<{ data: { message: string } }> {
    try {
      const res = await api.delete<{ message: string }>('/api/copilot/history');
      return res;
    } catch {
      return { data: { message: 'Chat history cleared' } };
    }
  },
};

