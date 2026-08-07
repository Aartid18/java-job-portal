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

export const resumeApi = {
  list: () => api.get<ResumeVersion[]>('/api/candidate/resumes'),
  get: (id: number) => api.get<ResumeVersion>(`/api/candidate/resumes/${id}`),
  create: (body: { title: string; templateName?: string; contentJson?: string }) =>
    api.post<ResumeVersion>('/api/candidate/resumes', body),
  update: (id: number, body: { title: string; templateName?: string; contentJson?: string }) =>
    api.put<ResumeVersion>(`/api/candidate/resumes/${id}`, body),
  remove: (id: number) => api.delete(`/api/candidate/resumes/${id}`),
  analyze: (file?: File) => {
    if (file) {
      const form = new FormData();
      form.append('file', file);
      return api.post<ResumeAnalysis>('/api/candidate/resumes/analyze', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.post<ResumeAnalysis>('/api/candidate/resumes/analyze');
  },
  enhanceBullet: (text: string) =>
    api.post<{ original: string; enhanced: string }>('/api/candidate/resumes/enhance-bullet', { text }),
};
