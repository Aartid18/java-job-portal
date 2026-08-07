export type Role = 'JOB_SEEKER' | 'RECRUITER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  fullName: string | null;
  role: Role;
  emailVerified: boolean;
  active: boolean;
  onboardingCompleted: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInMs: number;
  user: User;
}

export interface MessageResponse {
  message: string;
  devToken?: string | null;
}

export interface ApiError {
  timestamp?: string;
  status: number;
  error?: string;
  message: string;
  path?: string;
  details?: string[];
}
