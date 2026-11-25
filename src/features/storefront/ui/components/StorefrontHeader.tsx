'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, ClipboardList, ExternalLink, LogIn, LogOut, Store } from 'lucide-react';
import { LayoutContainer, Title, Text, Badge, Button } from '@/shared/ui/components';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { STOREFRONT_TEXTS } from '../../constants/storefront.constants';
import { storefrontService } from '../../services/storefront.service';

export const StorefrontHeader = () => {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const logoutStore = useAuthStore((s) => s.logout);
  const items = useCartStore((s) => s.items);

  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:7999';
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const isLoggedIn = Boolean(hasHydrated && user && accessToken);

  const handleLogout = async () => {
    await storefrontService.logoutCustomer();
    logoutStore();
  };

  return (
    <LayoutContainer as="header" className="border-b border-border bg-surface/90 backdrop-blur-xs sticky top-0 z-30">
      <LayoutContainer className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5">
          <Store className="w-5 h-5 text-primary shrink-0" />
          <Title level="h2" className="text-base sm:text-lg font-extrabold text-text-primary">
            {STOREFRONT_TEXTS.BADGE}
          </Title>
        </Link>

        <LayoutContainer className="flex flex-wrap items-center gap-2">
          <Link href="/">
            <Button variant="ghost" className="px-3 py-1.5 text-xs">
              {STOREFRONT_TEXTS.NAV_CATALOG}
            </Button>
          </Link>

          <Link href="/meus-pedidos">
            <Button variant="outline" className="px-3 py-1.5 text-xs">
              <ClipboardList className="w-3.5 h-3.5" />
              {STOREFRONT_TEXTS.NAV_MY_ORDERS}
            </Button>
          </Link>

          <Link href="/carrinho">
            <Button variant="primary" className="px-3 py-1.5 text-xs">
              <ShoppingCart className="w-3.5 h-3.5" />
              {STOREFRONT_TEXTS.NAV_CART}
              {itemCount > 0 && ` (${itemCount})`}
            </Button>
          </Link>

          {isLoggedIn && user ? (
            <LayoutContainer className="flex items-center gap-2 pl-1">
              <Text as="span" className="text-xs text-text-secondary hidden sm:inline truncate max-w-[140px]">
                {user.fullName}
              </Text>
              {user.isSocioActive && (
                <Badge variant="success">{STOREFRONT_TEXTS.SOCIO_ACTIVE_BADGE}</Badge>
              )}
              <Button variant="ghost" onClick={handleLogout} className="px-2 py-1.5 text-xs">
                <LogOut className="w-3.5 h-3.5" />
                {STOREFRONT_TEXTS.NAV_LOGOUT}
              </Button>
            </LayoutContainer>
          ) : (
            <Link href="/entrar">
              <Button variant="outline" className="px-3 py-1.5 text-xs">
                <LogIn className="w-3.5 h-3.5" />
                {STOREFRONT_TEXTS.NAV_LOGIN}
              </Button>
            </Link>
          )}

          <Link href={portalUrl}>
            <Button variant="ghost" className="px-2.5 py-1.5 text-xs hidden md:inline-flex">
              {STOREFRONT_TEXTS.BUTTON_BACK_PORTAL}
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
