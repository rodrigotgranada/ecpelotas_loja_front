'use client';

import React from 'react';
import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Input,
  Form,
  FormField,
} from '@/shared/ui/components';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { usePdvLogin } from '../../hooks/usePdvLogin';

export const PdvLoginFeature = () => {
  const { form, isSubmitting, handleLoginSubmit } = usePdvLogin();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <LayoutContainer as="main" className="min-h-screen flex items-center justify-center px-4 py-12">
      <LayoutContainer className="max-w-md w-full bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <LayoutContainer className="space-y-3">
          <Badge variant="primary">{PDV_TEXTS.LOGIN_BADGE}</Badge>
          <Title level="h1" className="text-2xl font-extrabold text-text-primary flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-primary shrink-0" />
            {PDV_TEXTS.LOGIN_TITLE}
          </Title>
          <Text className="text-sm text-text-secondary">{PDV_TEXTS.LOGIN_SUBTITLE}</Text>
        </LayoutContainer>

        <Form onSubmit={handleLoginSubmit} className="space-y-4">
          <FormField
            label={PDV_TEXTS.LOGIN_IDENTIFIER_LABEL}
            required
            error={errors.cpf?.message}
          >
            <Input
              {...register('cpf')}
              placeholder={PDV_TEXTS.LOGIN_IDENTIFIER_PLACEHOLDER}
              autoComplete="username"
              disabled={isSubmitting}
            />
          </FormField>

          <FormField
            label={PDV_TEXTS.LOGIN_PASSWORD_LABEL}
            required
            error={errors.password?.message}
          >
            <Input
              {...register('password')}
              type="password"
              placeholder={PDV_TEXTS.LOGIN_PASSWORD_PLACEHOLDER}
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </FormField>

          <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
            {isSubmitting ? PDV_TEXTS.BTN_SAVING : PDV_TEXTS.LOGIN_BTN_SUBMIT}
          </Button>
        </Form>

        <LayoutContainer className="pt-2 border-t border-border text-center">
          <Link href="/">
            <Button variant="ghost" className="text-xs">
              {PDV_TEXTS.NAV_STOREFRONT}
            </Button>
          </Link>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
