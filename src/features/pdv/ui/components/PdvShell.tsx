'use client';

import React from 'react';
import Link from 'next/link';
import {
  LogOut,
  Store,
  Package,
  FileText,
  History,
  LayoutDashboard,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { LayoutContainer, Title, Text, Badge, Button, Spinner } from '@/shared/ui/components';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { PDV_ROUTES } from '../../constants/pdv.routes';
import { usePdvShell } from '../../hooks/usePdvShell';

export interface PdvShellProps {
  children: React.ReactNode;
}

const INVENTORY_ROLES = new Set(['OWNER', 'ADMIN', 'STORE_MANAGER', 'STOCK_CLERK']);
const STAFF_ADMIN_ROLES = new Set(['OWNER', 'ADMIN', 'STORE_MANAGER']);

const NAV_ITEMS = [
  { href: PDV_ROUTES.HOME, label: PDV_TEXTS.NAV_HOME, icon: LayoutDashboard, scope: 'ALL' },
  { href: PDV_ROUTES.PRODUCTS, label: PDV_TEXTS.NAV_PRODUCTS, icon: Package, scope: 'ALL' },
  { href: PDV_ROUTES.INVOICES, label: PDV_TEXTS.NAV_INVOICES, icon: FileText, scope: 'INVENTORY' },
  { href: PDV_ROUTES.KARDEX, label: PDV_TEXTS.NAV_KARDEX, icon: History, scope: 'INVENTORY' },
  { href: PDV_ROUTES.STAFF, label: PDV_TEXTS.NAV_STAFF, icon: Users, scope: 'STAFF' },
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

  const role = (user?.role || '').toUpperCase();
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (item.scope === 'INVENTORY') return INVENTORY_ROLES.has(role);
    if (item.scope === 'STAFF') return STAFF_ADMIN_ROLES.has(role);
    return true;
  });

  return (
    <LayoutContainer className="min-h-screen flex flex-col">
      <LayoutContainer as="header" className="border-b border-border bg-surface/90 backdrop-blur-xs sticky top-0 z-30">
        <LayoutContainer className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <LayoutContainer className="flex items-center justify-between gap-4">
            <Link href={PDV_ROUTES.HOME} className="flex items-center gap-2.5">
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
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === PDV_ROUTES.HOME
                  ? pathname === PDV_ROUTES.HOME
                  : pathname.startsWith(item.href);
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
