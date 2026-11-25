'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { LayoutContainer, Text, Button, Spinner } from '@/shared/ui/components';
import { STOREFRONT_TEXTS } from '../../constants/storefront.constants';
import { useStoreSso } from '../../hooks/useStoreSso';

const SsoContent = () => {
  const { errorMessage } = useStoreSso();

  if (errorMessage) {
    return (
      <LayoutContainer className="max-w-md w-full bg-surface border border-border rounded-2xl p-6 text-center space-y-4">
        <Text className="text-sm text-[#ea580c] font-semibold">{errorMessage}</Text>
        <Link href="/entrar">
          <Button variant="primary">{STOREFRONT_TEXTS.CART_BTN_LOGIN}</Button>
        </Link>
      </LayoutContainer>
    );
  }

  return <Spinner text={STOREFRONT_TEXTS.SSO_TITLE} />;
};

export const StoreSsoFeature = () => {
  return (
    <LayoutContainer as="main" className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={<Spinner text={STOREFRONT_TEXTS.SSO_TITLE} />}>
        <SsoContent />
      </Suspense>
    </LayoutContainer>
  );
};
