'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { pdvService } from '../services/pdv.service';
import { PDV_ROUTES } from '../constants/pdv.routes';

const ALLOWED_PDV_ROLES = new Set([
  'OWNER',
  'ADMIN',
  'STORE_MANAGER',
  'SELLER',
  'STOCK_CLERK',
]);

export const usePdvShell = () => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const logoutStore = useAuthStore((s) => s.logout);

  const isAuthorized = useMemo(() => {
    if (!user || !accessToken) return false;
    return ALLOWED_PDV_ROLES.has(user.role);
  }, [user, accessToken]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user || !accessToken) {
      router.replace(PDV_ROUTES.LOGIN);
    }
  }, [hasHydrated, user, accessToken, router]);

  const handleLogout = async () => {
    await pdvService.logout();
    logoutStore();
    router.replace(PDV_ROUTES.LOGIN);
  };

  return {
    user,
    pathname,
    hasHydrated,
    isAuthenticated: Boolean(user && accessToken),
    isAuthorized,
    handleLogout,
  };
};
