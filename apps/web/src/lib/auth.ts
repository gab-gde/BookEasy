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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      admin: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post<AuthResponse>('/auth/login', {
            email,
            password,
          });
          set({
            token: response.token,
            admin: response.admin,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          token: null,
          admin: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;

        set({ isLoading: true });
        try {
          const admin = await api.get<AdminUser>('/auth/me', { token });
          set({ admin, isAuthenticated: true, isLoading: false });
        } catch {
          set({
            token: null,
            admin: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'bookeasy-auth',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
