'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { pdvService } from '../services/pdv.service';
import { PDV_TEXTS } from '../constants/pdv.constants';
import { PDV_ROUTES } from '../constants/pdv.routes';

const loginSchema = z.object({
  cpf: z.string().trim().min(1, PDV_TEXTS.LOGIN_IDENTIFIER_REQUIRED),
  password: z.string().min(1, PDV_TEXTS.LOGIN_PASSWORD_REQUIRED),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const usePdvLogin = () => {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inFlightRef = useRef(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { cpf: '', password: '' },
  });

  const submitLogin = async (values: LoginFormValues) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsSubmitting(true);

    try {
      const response = await pdvService.login(values.cpf, values.password);
      setSession(response.user, response.accessToken);
      toast.success(PDV_TEXTS.LOGIN_SUCCESS);
      router.replace(PDV_ROUTES.HOME);
    } catch (error) {
      const detail = axios.isAxiosError(error)
        ? (error.response?.data as { detail?: string; message?: string } | undefined)?.detail ??
          (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      toast.error(detail || PDV_TEXTS.LOGIN_ERROR);
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
    handleLoginSubmit,
  };
};
