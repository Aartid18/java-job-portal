const ACCESS_KEY = 'ajp_access_token';
const REFRESH_KEY = 'ajp_refresh_token';
const USER_KEY = 'ajp_user';

import type { User } from '../types/auth';

export const tokenStorage = {
  getAccess(): string | null {
    return localStorage.getItem(ACCESS_KEY) ?? sessionStorage.getItem(ACCESS_KEY);
  },
  getRefresh(): string | null {
    return localStorage.getItem(REFRESH_KEY) ?? sessionStorage.getItem(REFRESH_KEY);
  },
  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
  setSession(access: string, refresh: string, user: User, remember: boolean) {
    const primary = remember ? localStorage : sessionStorage;
    const secondary = remember ? sessionStorage : localStorage;
    secondary.removeItem(ACCESS_KEY);
    secondary.removeItem(REFRESH_KEY);
    secondary.removeItem(USER_KEY);
    primary.setItem(ACCESS_KEY, access);
    primary.setItem(REFRESH_KEY, refresh);
    primary.setItem(USER_KEY, JSON.stringify(user));
  },
  updateUser(user: User) {
    if (localStorage.getItem(ACCESS_KEY)) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },
  clear() {
    [localStorage, sessionStorage].forEach((store) => {
      store.removeItem(ACCESS_KEY);
      store.removeItem(REFRESH_KEY);
      store.removeItem(USER_KEY);
    });
  },
};
