'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { KeyRound, ExternalLink } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Input,
  Form,
  FormField,
  Spinner,
} from '@/shared/ui/components';
import { STOREFRONT_TEXTS } from '../../constants/storefront.constants';
import { useCustomerLogin } from '../../hooks/useCustomerLogin';
import { StorefrontHeader } from '../components/StorefrontHeader';

const CustomerLoginFormContent = () => {
  const { form, isSubmitting, portalRegisterUrl, handleLoginSubmit } = useCustomerLogin();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <LayoutContainer className="max-w-md w-full bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      <LayoutContainer className="space-y-3">
        <Badge variant="primary">{STOREFRONT_TEXTS.LOGIN_BADGE}</Badge>
        <Title level="h1" className="text-2xl font-extrabold text-text-primary flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-primary shrink-0" />
          {STOREFRONT_TEXTS.LOGIN_TITLE}
        </Title>
        <Text className="text-sm text-text-secondary">{STOREFRONT_TEXTS.LOGIN_SUBTITLE}</Text>
      </LayoutContainer>

      <Form onSubmit={handleLoginSubmit} className="space-y-4">
        <FormField
          label={STOREFRONT_TEXTS.LOGIN_IDENTIFIER_LABEL}
          required
          error={errors.cpf?.message}
        >
          <Input
            {...register('cpf')}
            placeholder={STOREFRONT_TEXTS.LOGIN_IDENTIFIER_PLACEHOLDER}
            autoComplete="username"
            disabled={isSubmitting}
          />
        </FormField>

        <FormField
          label={STOREFRONT_TEXTS.LOGIN_PASSWORD_LABEL}
          required
          error={errors.password?.message}
        >
          <Input
            {...register('password')}
            type="password"
            placeholder={STOREFRONT_TEXTS.LOGIN_PASSWORD_PLACEHOLDER}
            autoComplete="current-password"
            disabled={isSubmitting}
          />
        </FormField>

        <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
          {isSubmitting ? STOREFRONT_TEXTS.LOGIN_SUBMITTING : STOREFRONT_TEXTS.LOGIN_BTN_SUBMIT}
        </Button>
      </Form>

      <LayoutContainer className="pt-4 border-t border-border space-y-2 text-center">
        <Text className="text-xs text-text-secondary">{STOREFRONT_TEXTS.LOGIN_CREATE_PORTAL_HINT}</Text>
        <Link href={portalRegisterUrl} className="inline-block">
          <Button variant="outline" className="text-xs">
            {STOREFRONT_TEXTS.CART_BTN_REGISTER_PORTAL}
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </LayoutContainer>
    </LayoutContainer>
  );
};

export const CustomerLoginFeature = () => {
  return (
    <LayoutContainer className="min-h-screen flex flex-col">
      <StorefrontHeader />
      <LayoutContainer as="main" className="flex-1 flex items-center justify-center px-4 py-10">
        <Suspense fallback={<Spinner />}>
          <CustomerLoginFormContent />
        </Suspense>
      </LayoutContainer>
    </LayoutContainer>
  );
};
