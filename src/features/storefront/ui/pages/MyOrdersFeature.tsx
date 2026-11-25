'use client';

import React from 'react';
import Link from 'next/link';
import { ClipboardList, ExternalLink, XCircle } from 'lucide-react';
import { LayoutContainer, Title, Text, Button, Spinner } from '@/shared/ui/components';
import { STOREFRONT_TEXTS } from '../../constants/storefront.constants';
import { useMyOrders } from '../../hooks/useMyOrders';
import { formatCurrencyBrl, formatDateTimeBrt } from '../../utils/storefront.formatters';
import { StorefrontHeader } from '../components/StorefrontHeader';
import { OrderStatusBadge } from '../components/OrderStatusBadge';

export const MyOrdersFeature = () => {
  const { orders, isLoading, hasHydrated, isLoggedIn, cancellingCode, handleCancelOrder } =
    useMyOrders();

  return (
    <LayoutContainer className="min-h-screen flex flex-col">
      <StorefrontHeader />

      <LayoutContainer as="main" className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        <LayoutContainer className="space-y-1">
          <Title level="h1" className="text-2xl font-extrabold text-text-primary">
            {STOREFRONT_TEXTS.MY_ORDERS_TITLE}
          </Title>
          <Text className="text-sm text-text-secondary">{STOREFRONT_TEXTS.MY_ORDERS_SUBTITLE}</Text>
        </LayoutContainer>

        {!hasHydrated || isLoading ? (
          <Spinner text={STOREFRONT_TEXTS.MY_ORDERS_LOADING} />
        ) : !isLoggedIn ? (
          <LayoutContainer className="bg-surface border border-border rounded-2xl p-8 text-center space-y-4">
            <Text className="text-sm text-text-secondary">{STOREFRONT_TEXTS.MY_ORDERS_LOGIN_REQUIRED}</Text>
            <Link href="/entrar?redirect=/meus-pedidos">
              <Button variant="primary">{STOREFRONT_TEXTS.CART_BTN_LOGIN}</Button>
            </Link>
          </LayoutContainer>
        ) : orders.length === 0 ? (
          <LayoutContainer className="bg-surface border border-border rounded-2xl p-10 text-center space-y-3">
            <ClipboardList className="w-10 h-10 text-primary mx-auto opacity-80" />
            <Text className="text-sm text-text-secondary">{STOREFRONT_TEXTS.MY_ORDERS_EMPTY}</Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="space-y-4">
            {orders.map((order) => {
              const canCancel =
                order.status === 'PENDING_WHATSAPP' || order.status === 'NEGOTIATING';
              return (
                <LayoutContainer
                  key={order.id}
                  className="bg-surface border border-border rounded-2xl p-5 space-y-4"
                >
                  <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                    <LayoutContainer className="space-y-1">
                      <LayoutContainer className="flex flex-wrap items-center gap-2">
                        <Title level="h2" className="text-lg font-extrabold text-text-primary">
                          {order.orderCode}
                        </Title>
                        <OrderStatusBadge status={order.status} />
                      </LayoutContainer>
                      <Text className="text-xs text-text-secondary">
                        {formatDateTimeBrt(order.createdAt)}
                        {order.expiresAt && canCancel
                          ? ` · ${STOREFRONT_TEXTS.MY_ORDERS_EXPIRES_LABEL} ${formatDateTimeBrt(order.expiresAt)}`
                          : ''}
                      </Text>
                    </LayoutContainer>

                    <Text className="text-lg font-extrabold text-primary">
                      {STOREFRONT_TEXTS.MY_ORDERS_TOTAL_LABEL} {formatCurrencyBrl(order.totalAmount)}
                    </Text>
                  </LayoutContainer>

                  <LayoutContainer className="space-y-1.5">
                    {order.items.map((item) => (
                      <Text key={item.id} className="text-xs text-text-primary">
                        {item.quantity}x {item.productName} ({item.sizeLabel} · {item.sku}) —{' '}
                        {formatCurrencyBrl(item.lineTotal)}
                      </Text>
                    ))}
                  </LayoutContainer>

                  <LayoutContainer className="flex flex-wrap gap-2 pt-2">
                    {canCancel && order.whatsappUrl && (
                      <a href={order.whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="primary" className="text-xs py-1.5 px-3">
                          {STOREFRONT_TEXTS.MY_ORDERS_WHATSAPP_BTN}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </a>
                    )}
                    {canCancel && (
                      <Button
                        variant="outline"
                        disabled={cancellingCode === order.orderCode}
                        onClick={() => handleCancelOrder(order.orderCode)}
                        className="text-xs py-1.5 px-3 text-[#ea580c]"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        {cancellingCode === order.orderCode
                          ? STOREFRONT_TEXTS.MY_ORDERS_CANCELLING
                          : STOREFRONT_TEXTS.MY_ORDERS_CANCEL_BTN}
                      </Button>
                    )}
                  </LayoutContainer>
                </LayoutContainer>
              );
            })}
          </LayoutContainer>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
