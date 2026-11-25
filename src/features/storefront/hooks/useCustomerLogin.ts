'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { storefrontService } from '../services/storefront.service';
import { STOREFRONT_TEXTS } from '../constants/storefront.constants';
import { extractStorefrontError } from '../utils/storefront.formatters';

const customerLoginSchema = z.object({
  cpf: z.string().trim().min(1, STOREFRONT_TEXTS.LOGIN_IDENTIFIER_REQUIRED),
  password: z.string().min(1, STOREFRONT_TEXTS.LOGIN_PASSWORD_REQUIRED),
});

export type CustomerLoginValues = z.infer<typeof customerLoginSchema>;

export const useCustomerLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inFlightRef = useRef(false);

  const portalRegisterUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:7999'}/register`;

  const form = useForm<CustomerLoginValues>({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: { cpf: '', password: '' },
  });

  const submitLogin = async (values: CustomerLoginValues) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsSubmitting(true);

    try {
      const response = await storefrontService.loginCustomer(values.cpf, values.password);
      setSession(response.user, response.accessToken);
      toast.success(STOREFRONT_TEXTS.LOGIN_SUCCESS);

      const rawRedirect = searchParams.get('redirect') || '/';
      const safeRedirect = rawRedirect.startsWith('/') ? rawRedirect : '/';
      router.replace(safeRedirect);
    } catch (error) {
      toast.error(extractStorefrontError(error, STOREFRONT_TEXTS.LOGIN_ERROR));
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    void form.handleSubmit(submitLogin)(event);
  };

  return {
    form,
    isSubmitting,
    portalRegisterUrl,
    handleLoginSubmit,
  };
};
