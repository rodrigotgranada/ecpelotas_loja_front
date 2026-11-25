'use client';

import React from 'react';
import Link from 'next/link';
import {
  Package,
  FileText,
  History,
  MessageSquare,
  Users,
  ShoppingBag,
  Settings,
} from 'lucide-react';
import { LayoutContainer, Title, Text, Button } from '@/shared/ui/components';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { PDV_ROUTES } from '../../constants/pdv.routes';
import { PdvShell } from '../components/PdvShell';

const MODULE_CARDS = [
  {
    href: PDV_ROUTES.SALES,
    title: PDV_TEXTS.CARD_SALES_TITLE,
    description: PDV_TEXTS.CARD_SALES_DESC,
    icon: MessageSquare,
  },
  {
    href: PDV_ROUTES.COUNTER,
    title: PDV_TEXTS.CARD_COUNTER_TITLE,
    description: PDV_TEXTS.CARD_COUNTER_DESC,
    icon: ShoppingBag,
  },
  {
    href: PDV_ROUTES.PRODUCTS,
    title: PDV_TEXTS.CARD_PRODUCTS_TITLE,
    description: PDV_TEXTS.CARD_PRODUCTS_DESC,
    icon: Package,
  },
  {
    href: PDV_ROUTES.INVOICES,
    title: PDV_TEXTS.CARD_INVOICES_TITLE,
    description: PDV_TEXTS.CARD_INVOICES_DESC,
    icon: FileText,
  },
  {
    href: PDV_ROUTES.KARDEX,
    title: PDV_TEXTS.CARD_KARDEX_TITLE,
    description: PDV_TEXTS.CARD_KARDEX_DESC,
    icon: History,
  },
  {
    href: PDV_ROUTES.STAFF,
    title: PDV_TEXTS.CARD_STAFF_TITLE,
    description: PDV_TEXTS.CARD_STAFF_DESC,
    icon: Users,
  },
  {
    href: PDV_ROUTES.SETTINGS,
    title: PDV_TEXTS.CARD_SETTINGS_TITLE,
    description: PDV_TEXTS.CARD_SETTINGS_DESC,
    icon: Settings,
  },
] as const;

export const PdvHomeFeature = () => {
  return (
    <PdvShell>
      <LayoutContainer className="space-y-8">
        <LayoutContainer className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-2">
          <Title level="h1" className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            {PDV_TEXTS.HOME_TITLE}
          </Title>
          <Text className="text-sm sm:text-base text-text-secondary max-w-3xl">
            {PDV_TEXTS.HOME_SUBTITLE}
          </Text>
        </LayoutContainer>

        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <LayoutContainer
                key={card.title}
                className="bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between gap-5"
              >
                <LayoutContainer className="space-y-3">
                  <Icon className="w-6 h-6 text-primary shrink-0" />
                  <Title level="h2" className="text-lg font-bold text-text-primary">
                    {card.title}
                  </Title>
                  <Text className="text-sm text-text-secondary leading-relaxed">
                    {card.description}
                  </Text>
                </LayoutContainer>

                <LayoutContainer>
                  <Link href={card.href}>
                    <Button variant="primary">{PDV_TEXTS.CARD_ACCESS_ACTION}</Button>
                  </Link>
                </LayoutContainer>
              </LayoutContainer>
            );
          })}
        </LayoutContainer>
      </LayoutContainer>
    </PdvShell>
  );
};
