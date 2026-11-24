'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutContainer, Title, Text, Badge, Button } from '@/shared/ui/components';
import { PDV_TEXTS } from '../../constants/pdv.constants';

export const PdvHomeFeature = () => {
  return (
    <LayoutContainer
      as="main"
      className="min-h-screen flex items-center justify-center px-4 py-12"
    >
      <LayoutContainer className="max-w-2xl w-full bg-surface border border-border rounded-2xl p-6 sm:p-10 shadow-xl space-y-5">
        <Badge variant="primary">{PDV_TEXTS.BADGE}</Badge>
        <Title level="h1" className="text-2xl sm:text-3xl font-extrabold text-text-primary">
          {PDV_TEXTS.TITLE}
        </Title>
        <Text className="text-sm sm:text-base text-text-secondary leading-relaxed">
          {PDV_TEXTS.SUBTITLE}
        </Text>
        <LayoutContainer className="pt-2">
          <Link href="/">
            <Button variant="outline">{PDV_TEXTS.BUTTON_BACK_STOREFRONT}</Button>
          </Link>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
