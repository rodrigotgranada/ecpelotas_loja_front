'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { storefrontService } from '../services/storefront.service';
import { STOREFRONT_TEXTS } from '../constants/storefront.constants';

export const useStoreSso = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const rawRedirect = searchParams.get('redirect') || '/';
    const safeRedirect = rawRedirect.startsWith('/') ? rawRedirect : '/';

    if (!token) {
      const timer = setTimeout(() => {
        setErrorMessage(STOREFRONT_TEXTS.SSO_ERROR);
      }, 0);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(async () => {
      try {
        const res = await storefrontService.exchangeSsoToken(token);
        setSession(res.user, res.accessToken);
        toast.success(STOREFRONT_TEXTS.LOGIN_SUCCESS);
        router.replace(safeRedirect);
      } catch {
        setErrorMessage(STOREFRONT_TEXTS.SSO_ERROR);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [searchParams, setSession, router]);

  return { errorMessage };
};
