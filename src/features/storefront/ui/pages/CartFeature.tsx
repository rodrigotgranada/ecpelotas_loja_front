'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Trash2, CheckCircle2, ExternalLink } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Input,
  Form,
  FormField,
  SafeImage,
  Spinner,
} from '@/shared/ui/components';
import { STOREFRONT_TEXTS } from '../../constants/storefront.constants';
import { useCartFeature } from '../../hooks/useCartFeature';
import { formatCurrencyBrl, formatDateTimeBrt } from '../../utils/storefront.formatters';
import { StorefrontHeader } from '../components/StorefrontHeader';

export const CartFeature = () => {
  const {
    items,
    hasHydrated,
    isLoggedIn,
    hasValidCpf,
    isSocioActive,
    portalRegisterUrl,
    portalProfileUrl,
    customerWhatsapp,
    setCustomerWhatsapp,
    notes,
    setNotes,
    totals,
    isSubmitting,
    createdOrder,
    updateQuantity,
    removeItem,
    handleSubmitReservation,
  } = useCartFeature();

  return (
    <LayoutContainer className="min-h-screen flex flex-col">
      <StorefrontHeader />

      <LayoutContainer as="main" className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        <Title level="h1" className="text-2xl font-extrabold text-text-primary">
          {STOREFRONT_TEXTS.CART_TITLE}
        </Title>

        {!hasHydrated ? (
          <Spinner />
        ) : createdOrder ? (
          <LayoutContainer className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-5">
            <LayoutContainer className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-success shrink-0" />
              <LayoutContainer className="space-y-1">
                <Title level="h2" className="text-xl font-bold text-text-primary">
                  {STOREFRONT_TEXTS.CART_RESERVED_DONE_TITLE} ({createdOrder.orderCode})
                </Title>
                <Text className="text-xs text-text-secondary">
                  {STOREFRONT_TEXTS.CART_RESERVED_EXPIRES}: {formatDateTimeBrt(createdOrder.expiresAt)}
                </Text>
              </LayoutContainer>
            </LayoutContainer>

            <LayoutContainer className="flex flex-wrap gap-3">
              {createdOrder.whatsappUrl && (
                <a href={createdOrder.whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary">
                    {STOREFRONT_TEXTS.CART_OPEN_WHATSAPP_BTN}
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              )}
              <Link href="/meus-pedidos">
                <Button variant="outline">{STOREFRONT_TEXTS.CART_GO_MY_ORDERS}</Button>
              </Link>
            </LayoutContainer>
          </LayoutContainer>
        ) : items.length === 0 ? (
          <LayoutContainer className="bg-surface border border-border rounded-2xl p-10 text-center space-y-4">
            <ShoppingCart className="w-10 h-10 text-primary mx-auto opacity-80" />
            <Title level="h2" className="text-lg font-bold text-text-primary">
              {STOREFRONT_TEXTS.CART_EMPTY_TITLE}
            </Title>
            <Text className="text-sm text-text-secondary">{STOREFRONT_TEXTS.CART_EMPTY_DESC}</Text>
            <Link href="/">
              <Button variant="primary">{STOREFRONT_TEXTS.CART_EMPTY_BTN}</Button>
            </Link>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <LayoutContainer className="lg:col-span-7 space-y-3">
              {items.map((item) => (
                <LayoutContainer
                  key={item.variantId}
                  className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4"
                >
                  <SafeImage
                    src={item.coverImageUrl}
                    alt={item.productName}
                    className="w-20 h-20 rounded-xl object-cover border border-border shrink-0"
                  />

                  <LayoutContainer className="flex-1 space-y-1">
                    <Text className="text-sm font-bold text-text-primary">{item.productName}</Text>
                    <Text className="text-xs text-text-secondary">
                      {item.sizeLabel} · {item.sku}
                    </Text>
                    <Text className="text-sm font-bold text-primary">
                      {formatCurrencyBrl(
                        isSocioActive && item.memberPrice != null ? item.memberPrice : item.salePrice,
                      )}
                    </Text>
                  </LayoutContainer>

                  <LayoutContainer className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={item.availableStock}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.variantId, Number(e.target.value) || 1)}
                      className="w-16 text-center py-1.5"
                    />
                    <Button
                      variant="ghost"
                      onClick={() => removeItem(item.variantId)}
                      className="text-[#ea580c] p-2"
                      aria-label={STOREFRONT_TEXTS.CART_REMOVE_BTN}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </LayoutContainer>
                </LayoutContainer>
              ))}
            </LayoutContainer>

            <LayoutContainer className="lg:col-span-5 bg-surface border border-border rounded-2xl p-5 sm:p-6 space-y-5">
              <LayoutContainer className="space-y-2 border-b border-border pb-4">
                <LayoutContainer className="flex justify-between text-sm">
                  <Text as="span" className="text-text-secondary">{STOREFRONT_TEXTS.CART_SUBTOTAL}</Text>
                  <Text as="span" className="text-text-primary">{formatCurrencyBrl(totals.subtotal)}</Text>
                </LayoutContainer>
                {totals.discount > 0 && (
                  <LayoutContainer className="flex justify-between text-sm">
                    <Text as="span" className="text-success">{STOREFRONT_TEXTS.CART_SOCIO_DISCOUNT}</Text>
                    <Text as="span" className="text-success font-semibold">
                      - {formatCurrencyBrl(totals.discount)}
                    </Text>
                  </LayoutContainer>
                )}
                <LayoutContainer className="flex justify-between text-base font-extrabold pt-1">
                  <Text as="span" className="text-text-primary">{STOREFRONT_TEXTS.CART_TOTAL}</Text>
                  <Text as="span" className="text-primary">{formatCurrencyBrl(totals.total)}</Text>
                </LayoutContainer>
              </LayoutContainer>

              {!isLoggedIn ? (
                <LayoutContainer className="space-y-4">
                  <Badge variant="warning">{STOREFRONT_TEXTS.CART_LOGIN_REQUIRED_TITLE}</Badge>
                  <Text className="text-xs text-text-secondary leading-relaxed">
                    {STOREFRONT_TEXTS.CART_LOGIN_REQUIRED_DESC}
                  </Text>
                  <LayoutContainer className="flex flex-col gap-2.5">
                    <Link href="/entrar?redirect=/carrinho">
                      <Button variant="primary" className="w-full">
                        {STOREFRONT_TEXTS.CART_BTN_LOGIN}
                      </Button>
                    </Link>
                    <Link href={portalRegisterUrl}>
                      <Button variant="outline" className="w-full text-xs">
                        {STOREFRONT_TEXTS.CART_BTN_REGISTER_PORTAL}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </LayoutContainer>
                </LayoutContainer>
              ) : !hasValidCpf ? (
                <LayoutContainer className="space-y-3 p-4 rounded-xl bg-warning/10 border border-warning/30">
                  <Text className="text-xs text-warning font-medium">{STOREFRONT_TEXTS.CART_CPF_MISSING}</Text>
                  <Link href={portalProfileUrl}>
                    <Button variant="outline" className="text-xs">
                      {STOREFRONT_TEXTS.BUTTON_BACK_PORTAL}
                    </Button>
                  </Link>
                </LayoutContainer>
              ) : (
                <Form onSubmit={handleSubmitReservation} className="space-y-4">
                  <FormField label={STOREFRONT_TEXTS.CART_WHATSAPP_LABEL} required>
                    <Input
                      value={customerWhatsapp}
                      onChange={(e) => setCustomerWhatsapp(e.target.value)}
                      placeholder={STOREFRONT_TEXTS.CART_WHATSAPP_PLACEHOLDER}
                      disabled={isSubmitting}
                    />
                  </FormField>

                  <FormField label={STOREFRONT_TEXTS.CART_NOTES_LABEL}>
                    <Input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </FormField>

                  <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? STOREFRONT_TEXTS.CART_SUBMITTING : STOREFRONT_TEXTS.CART_SUBMIT_BTN}
                  </Button>
                </Form>
              )}
            </LayoutContainer>
          </LayoutContainer>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
