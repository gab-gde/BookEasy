'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from './api';
import { AdminUser, AuthResponse } from '@bookeasy/shared';

interface AuthState {
  token: string | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(persist((set, get) => ({
  token: null, admin: null, isAuthenticated: false, isLoading: false,
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const data = await api.post<AuthResponse>('/auth/login', { email, password });
      set({ token: data.token, admin: data.admin, isAuthenticated: true, isLoading: false });
    } catch (e) { set({ isLoading: false }); throw e; }
  },
  logout: () => set({ token: null, admin: null, isAuthenticated: false }),
  checkAuth: async () => {
    const { token } = get();
    if (!token) { set({ isAuthenticated: false }); return; }
    set({ isLoading: true });
    try {
      const admin = await api.get<AdminUser>('/auth/me', { token });
      set({ admin, isAuthenticated: true, isLoading: false });
    } catch { set({ token: null, admin: null, isAuthenticated: false, isLoading: false }); }
  },
}), { name: 'bookeasy-auth' }));
