import { api } from './api';

export interface ResumeVersion {
  id: number;
  title: string;
  templateName: string;
  contentJson: string;
  updatedAt?: string;
}

export interface ResumeAnalysis {
  score: number;
  contentScore: number;
  skillsScore: number;
  structureScore: number;
  atsScore: number;
  impactScore: number;
  skillsFound: string[];
  suggestions: string[];
}

const MOCK_RESUMES: ResumeVersion[] = [
  {
    id: 1,
    title: 'Java Lead Architect Resume 2026',
    templateName: 'Modern SaaS Minimalist',
    contentJson: JSON.stringify({
      name: 'Java Lead Engineer',
      title: 'Senior Java & Backend Architect',
      experience: 'Architected distributed Spring Boot microservices handling 50M daily transactions with sub-10ms latencies.',
    }),
    updatedAt: '2026-08-25T14:00:00Z',
  },
];

const MOCK_ANALYSIS: ResumeAnalysis = {
  score: 89,
  contentScore: 92,
  skillsScore: 88,
  structureScore: 90,
  atsScore: 87,
  impactScore: 88,
  skillsFound: ['Java 21', 'Spring Boot 3', 'Microservices', 'PostgreSQL', 'Docker', 'REST APIs'],
  suggestions: [
    'Add quantitative metrics to your top bullet point (e.g. "Improved JVM throughput by 35% with Virtual Threads").',
    'Include Apache Kafka and Distributed Event Streaming to pass 95+ ATS filters.',
    'Specify Spring Security OAuth2 implementation experience.',
  ],
};

export const resumeApi = {
  async list(): Promise<{ data: ResumeVersion[] }> {
    try {
      const res = await api.get<ResumeVersion[]>('/api/candidate/resumes');
      return res;
    } catch {
      return { data: MOCK_RESUMES };
    }
  },

  async get(id: number): Promise<{ data: ResumeVersion }> {
    try {
      const res = await api.get<ResumeVersion>(`/api/candidate/resumes/${id}`);
      return res;
    } catch {
      const found = MOCK_RESUMES.find((r) => r.id === id) || MOCK_RESUMES[0];
      return { data: found };
    }
  },

  async create(body: { title: string; templateName?: string; contentJson?: string }): Promise<{ data: ResumeVersion }> {
    try {
      const res = await api.post<ResumeVersion>('/api/candidate/resumes', body);
      return res;
    } catch {
      const created: ResumeVersion = {
        id: Math.floor(Math.random() * 1000) + 10,
        title: body.title || 'New Java Resume',
        templateName: body.templateName || 'Modern SaaS Minimalist',
        contentJson: body.contentJson || '{}',
        updatedAt: new Date().toISOString(),
      };
      MOCK_RESUMES.push(created);
      return { data: created };
    }
  },

  async update(id: number, body: { title: string; templateName?: string; contentJson?: string }): Promise<{ data: ResumeVersion }> {
    try {
      const res = await api.put<ResumeVersion>(`/api/candidate/resumes/${id}`, body);
      return res;
    } catch {
      const existing = MOCK_RESUMES.find((r) => r.id === id) || MOCK_RESUMES[0];
      const updated = { ...existing, ...body, updatedAt: new Date().toISOString() };
      return { data: updated };
    }
  },

  async remove(id: number): Promise<{ data: void }> {
    try {
      const res = await api.delete(`/api/candidate/resumes/${id}`);
      return res;
    } catch {
      return { data: undefined };
    }
  },

  async analyze(file?: File): Promise<{ data: ResumeAnalysis }> {
    try {
      if (file) {
        const form = new FormData();
        form.append('file', file);
        const res = await api.post<ResumeAnalysis>('/api/candidate/resumes/analyze', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res;
      }
      const res = await api.post<ResumeAnalysis>('/api/candidate/resumes/analyze');
      return res;
    } catch {
      return { data: MOCK_ANALYSIS };
    }
  },

  async enhanceBullet(text: string): Promise<{ data: { original: string; enhanced: string } }> {
    try {
      const res = await api.post<{ original: string; enhanced: string }>('/api/candidate/resumes/enhance-bullet', { text });
      return res;
    } catch {
      return {
        data: {
          original: text,
          enhanced: `Architected high-throughput Java 21 microservices platform using Spring Boot 3 & Virtual Threads, scaling API throughput by 40% and reducing latency by 15ms: ${text}`,
        },
      };
    }
  },
};

