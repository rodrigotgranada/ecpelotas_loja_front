'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Store, ExternalLink } from 'lucide-react';
import { LayoutContainer, Title, Text, Badge, Button } from '@/shared/ui/components';
import { STOREFRONT_TEXTS } from '../../constants/storefront.constants';

export const StorefrontHomeFeature = () => {
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:7999';

  return (
    <LayoutContainer
      as="main"
      className="min-h-screen flex items-center justify-center px-4 py-12"
    >
      <LayoutContainer className="max-w-3xl w-full bg-surface border border-border rounded-2xl p-6 sm:p-10 shadow-xl space-y-6">
        <Badge variant="primary">{STOREFRONT_TEXTS.BADGE}</Badge>

        <LayoutContainer className="space-y-2">
          <Title level="h1" className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            {STOREFRONT_TEXTS.TITLE}
          </Title>
          <Text className="text-sm sm:text-base text-text-secondary leading-relaxed">
            {STOREFRONT_TEXTS.SUBTITLE}
          </Text>
        </LayoutContainer>

        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <LayoutContainer className="p-4 rounded-xl border border-border bg-background/60 space-y-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <Title level="h3" className="text-base font-bold text-text-primary">
              {STOREFRONT_TEXTS.CARD_CATALOG_TITLE}
            </Title>
            <Text className="text-xs text-text-secondary leading-relaxed">
              {STOREFRONT_TEXTS.CARD_CATALOG_DESC}
            </Text>
          </LayoutContainer>

          <LayoutContainer className="p-4 rounded-xl border border-border bg-background/60 space-y-2">
            <Store className="w-5 h-5 text-primary" />
            <Title level="h3" className="text-base font-bold text-text-primary">
              {STOREFRONT_TEXTS.CARD_PDV_TITLE}
            </Title>
            <Text className="text-xs text-text-secondary leading-relaxed">
              {STOREFRONT_TEXTS.CARD_PDV_DESC}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="flex flex-wrap gap-3 pt-2">
          <Link href="/pdv">
            <Button variant="primary">{STOREFRONT_TEXTS.BUTTON_OPEN_PDV}</Button>
          </Link>
          <Link href={portalUrl}>
            <Button variant="outline">
              {STOREFRONT_TEXTS.BUTTON_BACK_PORTAL}
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
