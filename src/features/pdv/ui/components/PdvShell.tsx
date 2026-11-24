'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut, Store, Package, FileText, History, LayoutDashboard, ShieldAlert } from 'lucide-react';
import { LayoutContainer, Title, Text, Badge, Button, Spinner } from '@/shared/ui/components';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { usePdvShell } from '../../hooks/usePdvShell';

export interface PdvShellProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: '/pdv', label: PDV_TEXTS.NAV_HOME, icon: LayoutDashboard },
  { href: '/pdv/produtos', label: PDV_TEXTS.NAV_PRODUCTS, icon: Package },
  { href: '/pdv/notas', label: PDV_TEXTS.NAV_INVOICES, icon: FileText },
  { href: '/pdv/kardex', label: PDV_TEXTS.NAV_KARDEX, icon: History },
] as const;

export const PdvShell = ({ children }: PdvShellProps) => {
  const { user, pathname, hasHydrated, isAuthenticated, isAuthorized, handleLogout } = usePdvShell();

  if (!hasHydrated || !isAuthenticated) {
    return (
      <LayoutContainer as="main" className="min-h-screen flex items-center justify-center p-6">
        <Spinner text={PDV_TEXTS.CHECKING_SESSION} />
      </LayoutContainer>
    );
  }

  if (!isAuthorized) {
    return (
      <LayoutContainer as="main" className="min-h-screen flex items-center justify-center p-6">
        <LayoutContainer className="max-w-md w-full bg-surface border border-border rounded-2xl p-6 text-center space-y-4">
          <ShieldAlert className="w-10 h-10 text-[#ea580c] mx-auto" />
          <Text className="text-sm text-text-primary font-semibold">{PDV_TEXTS.ACCESS_DENIED}</Text>
          <LayoutContainer className="flex justify-center gap-3 pt-2">
            <Link href="/">
              <Button variant="outline">{PDV_TEXTS.NAV_STOREFRONT}</Button>
            </Link>
            <Button variant="primary" onClick={handleLogout}>
              {PDV_TEXTS.BTN_LOGOUT}
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="min-h-screen flex flex-col">
      <LayoutContainer as="header" className="border-b border-border bg-surface/90 backdrop-blur-xs sticky top-0 z-30">
        <LayoutContainer className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <LayoutContainer className="flex items-center justify-between gap-4">
            <Link href="/pdv" className="flex items-center gap-2.5">
              <Title level="h2" className="text-base sm:text-lg font-extrabold text-text-primary">
                {PDV_TEXTS.BRAND}
              </Title>
            </Link>
            {user && (
              <LayoutContainer className="flex items-center gap-2 lg:hidden">
                <Badge variant="primary">{user.role}</Badge>
              </LayoutContainer>
            )}
          </LayoutContainer>

          <LayoutContainer as="nav" className="flex flex-wrap items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = item.href === '/pdv' ? pathname === '/pdv' : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <Button variant={active ? 'primary' : 'outline'} className="px-3 py-1.5 text-xs">
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </LayoutContainer>

          <LayoutContainer className="flex items-center justify-between lg:justify-end gap-3">
            {user && (
              <LayoutContainer className="hidden lg:flex items-center gap-2">
                <Text as="span" className="text-xs text-text-secondary truncate max-w-[160px]">
                  {user.fullName}
                </Text>
                <Badge variant="primary">{user.role}</Badge>
              </LayoutContainer>
            )}
            <Link href="/">
              <Button variant="ghost" className="px-2.5 py-1.5 text-xs">
                <Store className="w-3.5 h-3.5" />
                {PDV_TEXTS.NAV_STOREFRONT}
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} className="px-3 py-1.5 text-xs">
              <LogOut className="w-3.5 h-3.5" />
              {PDV_TEXTS.BTN_LOGOUT}
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      <LayoutContainer as="main" className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8">
        {children}
      </LayoutContainer>
    </LayoutContainer>
  );
};
