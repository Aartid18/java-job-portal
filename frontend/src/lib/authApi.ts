import { api } from './api';
import type { AuthResponse, MessageResponse, User } from '../types/auth';

export const authApi = {
  register(payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    accountType: 'JOB_SEEKER' | 'RECRUITER';
  }) {
    return api.post<MessageResponse>('/api/auth/register', payload);
  },
  login(payload: { email: string; password: string; rememberMe?: boolean }) {
    return api.post<AuthResponse>('/api/auth/login', payload);
  },
  verifyEmail(token: string) {
    return api.post<MessageResponse>('/api/auth/verify-email', { token });
  },
  resendVerification(email: string) {
    return api.post<MessageResponse>('/api/auth/resend-verification', { email });
  },
  forgotPassword(email: string) {
    return api.post<MessageResponse>('/api/auth/forgot-password', { email });
  },
  resetPassword(payload: { token: string; newPassword: string; confirmPassword: string }) {
    return api.post<MessageResponse>('/api/auth/reset-password', payload);
  },
  logout(refreshToken: string) {
    return api.post<MessageResponse>('/api/auth/logout', { refreshToken });
  },
  me() {
    return api.get<User>('/api/auth/me');
  },
  completeOnboarding() {
    return api.post<User>('/api/auth/complete-onboarding');
  },
};
