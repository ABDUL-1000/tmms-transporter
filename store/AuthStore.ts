import { create } from 'zustand';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: (token) => {
    sessionStorage.setItem('token', token);
    set({ token });
  },
  clearToken: () => {
    sessionStorage.removeItem('token');
    set({ token: null });
  },
}));
