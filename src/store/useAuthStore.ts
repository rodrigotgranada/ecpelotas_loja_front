import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StoreUser {
  id: string;
  portalUserId: string;
  fullName: string;
  email?: string;
  cpf?: string;
  role: string;
  isSocioActive: boolean;
  socioPlanName?: string;
  active: boolean;
}

interface AuthState {
  user: StoreUser | null;
  accessToken: string | null;
  hasHydrated: boolean;
  setSession: (user: StoreUser, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setHasHydrated: (hydrated: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      hasHydrated: false,
      setSession: (user, accessToken) => set({ user, accessToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      logout: () => set({ user: null, accessToken: null }),
    }),
    {
      name: 'ecp-loja-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
