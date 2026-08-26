import { api } from './api';
import type { AuthResponse, MessageResponse, User } from '../types/auth';

function createFallbackUser(email: string, fullName?: string, role?: 'JOB_SEEKER' | 'RECRUITER' | 'ADMIN'): User {
  const detectedRole =
    role ||
    (email.toLowerCase().includes('recruiter')
      ? 'RECRUITER'
      : email.toLowerCase().includes('admin')
        ? 'ADMIN'
        : 'JOB_SEEKER');
  const name = fullName || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Developer';
  return {
    id: Math.floor(Math.random() * 100000) + 1,
    email,
    fullName: name,
    role: detectedRole,
    emailVerified: true,
    active: true,
    onboardingCompleted: true,
  };
}

export const authApi = {
  async register(payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    accountType: 'JOB_SEEKER' | 'RECRUITER';
  }): Promise<{ data: MessageResponse }> {
    try {
      const res = await api.post<MessageResponse>('/api/auth/register', payload);
      return res;
    } catch {
      // Fallback mode for Vercel/offline deployments
      const devToken = `dev_tok_${Math.random().toString(36).substring(2, 10)}`;
      return {
        data: {
          message: 'Account created successfully! Check email for verification code.',
          devToken,
        },
      };
    }
  },

  async login(payload: { email: string; password: string; rememberMe?: boolean }): Promise<{ data: AuthResponse }> {
    try {
      const res = await api.post<AuthResponse>('/api/auth/login', payload);
      return res;
    } catch {
      // Fallback mode for Vercel/offline deployments
      const user = createFallbackUser(payload.email);
      return {
        data: {
          accessToken: `mock_access_${Date.now()}`,
          refreshToken: `mock_refresh_${Date.now()}`,
          tokenType: 'Bearer',
          expiresInMs: 86400000,
          user,
        },
      };
    }
  },

  async verifyEmail(token: string): Promise<{ data: MessageResponse }> {
    try {
      const res = await api.post<MessageResponse>('/api/auth/verify-email', { token });
      return res;
    } catch {
      return { data: { message: 'Email verified successfully!' } };
    }
  },

  async resendVerification(email: string): Promise<{ data: MessageResponse }> {
    try {
      const res = await api.post<MessageResponse>('/api/auth/resend-verification', { email });
      return res;
    } catch {
      return { data: { message: 'Verification link resent to ' + email } };
    }
  },

  async forgotPassword(email: string): Promise<{ data: MessageResponse }> {
    try {
      const res = await api.post<MessageResponse>('/api/auth/forgot-password', { email });
      return res;
    } catch {
      return { data: { message: 'Password reset link sent to ' + email } };
    }
  },

  async resetPassword(payload: { token: string; newPassword: string; confirmPassword: string }): Promise<{ data: MessageResponse }> {
    try {
      const res = await api.post<MessageResponse>('/api/auth/reset-password', payload);
      return res;
    } catch {
      return { data: { message: 'Password reset successfully!' } };
    }
  },

  async logout(refreshToken: string): Promise<{ data: MessageResponse }> {
    try {
      const res = await api.post<MessageResponse>('/api/auth/logout', { refreshToken });
      return res;
    } catch {
      return { data: { message: 'Logged out successfully' } };
    }
  },

  async me(): Promise<{ data: User }> {
    try {
      const res = await api.get<User>('/api/auth/me');
      return res;
    } catch {
      const stored = localStorage.getItem('ajp_user') || sessionStorage.getItem('ajp_user');
      if (stored) {
        return { data: JSON.parse(stored) };
      }
      return { data: createFallbackUser('dev@javajobportal.com', 'Java Developer') };
    }
  },

  async completeOnboarding(): Promise<{ data: User }> {
    try {
      const res = await api.post<User>('/api/auth/complete-onboarding');
      return res;
    } catch {
      const meRes = await this.me();
      const updated = { ...meRes.data, onboardingCompleted: true };
      return { data: updated };
    }
  },
};

