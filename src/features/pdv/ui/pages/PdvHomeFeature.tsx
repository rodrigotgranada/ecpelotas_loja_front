'use client';

import React from 'react';
import Link from 'next/link';
import { Package, FileText, History, MessageSquare } from 'lucide-react';
import { LayoutContainer, Title, Text, Badge, Button } from '@/shared/ui/components';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { PdvShell } from '../components/PdvShell';

const MODULE_CARDS = [
  {
    href: '/pdv/produtos',
    title: PDV_TEXTS.CARD_PRODUCTS_TITLE,
    description: PDV_TEXTS.CARD_PRODUCTS_DESC,
    icon: Package,
    available: true,
  },
  {
    href: '/pdv/notas',
    title: PDV_TEXTS.CARD_INVOICES_TITLE,
    description: PDV_TEXTS.CARD_INVOICES_DESC,
    icon: FileText,
    available: true,
  },
  {
    href: '/pdv/kardex',
    title: PDV_TEXTS.CARD_KARDEX_TITLE,
    description: PDV_TEXTS.CARD_KARDEX_DESC,
    icon: History,
    available: true,
  },
  {
    href: null,
    title: PDV_TEXTS.CARD_WHATSAPP_TITLE,
    description: PDV_TEXTS.CARD_WHATSAPP_DESC,
    icon: MessageSquare,
    available: false,
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

        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MODULE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <LayoutContainer
                key={card.title}
                className="bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between gap-5"
              >
                <LayoutContainer className="space-y-3">
                  <LayoutContainer className="flex items-center justify-between gap-3">
                    <Icon className="w-6 h-6 text-primary shrink-0" />
                    {!card.available && <Badge variant="default">{PDV_TEXTS.CARD_PHASE_SOON}</Badge>}
                  </LayoutContainer>
                  <Title level="h2" className="text-lg font-bold text-text-primary">
                    {card.title}
                  </Title>
                  <Text className="text-sm text-text-secondary leading-relaxed">
                    {card.description}
                  </Text>
                </LayoutContainer>

                {card.available && card.href && (
                  <LayoutContainer>
                    <Link href={card.href}>
                      <Button variant="primary">{PDV_TEXTS.CARD_ACCESS_ACTION}</Button>
                    </Link>
                  </LayoutContainer>
                )}
              </LayoutContainer>
            );
          })}
        </LayoutContainer>
      </LayoutContainer>
    </PdvShell>
  );
};
