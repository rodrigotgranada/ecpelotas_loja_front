'use client';

import React from 'react';
import { Search, ShoppingBag, Trash2, UserCheck, Store } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Input,
  Form,
  FormField,
} from '@/shared/ui/components';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { usePdvCounterSale } from '../../hooks/usePdvCounterSale';
import { formatCurrencyBrl } from '../../utils/pdv.formatters';
import { PdvShell } from '../components/PdvShell';
import { PaymentLinesBuilder } from '../components/PaymentLinesBuilder';
import { OrderReceiptModal } from '../components/OrderReceiptModal';

export const PdvCounterSaleFeature = () => {
  const counter = usePdvCounterSale();

  return (
    <PdvShell>
      <LayoutContainer className="space-y-6">
        <LayoutContainer className="space-y-1">
          <Title level="h1" className="text-2xl font-extrabold text-text-primary flex items-center gap-2">
            <Store className="w-6 h-6 text-primary shrink-0" />
            {PDV_TEXTS.COUNTER_TITLE}
          </Title>
          <Text className="text-xs sm:text-sm text-text-secondary">{PDV_TEXTS.COUNTER_SUBTITLE}</Text>
        </LayoutContainer>

        <LayoutContainer className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Esquerda: Scanner / Busca + Carrinho Balcão */}
          <LayoutContainer className="lg:col-span-7 space-y-4">
            <Form onSubmit={counter.handleSearchOrScan} className="flex gap-2">
              <LayoutContainer className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-text-secondary absolute left-3.5 pointer-events-none" />
                <Input
                  value={counter.scanQuery}
                  onChange={(e) => counter.setScanQuery(e.target.value)}
                  placeholder={PDV_TEXTS.COUNTER_SCAN_PLACEHOLDER}
                  className="pl-10"
                />
              </LayoutContainer>
              <Button type="submit" variant="primary" className="shrink-0">
                {PDV_TEXTS.INVOICES_BTN_SEARCH}
              </Button>
            </Form>

            {counter.searchResults.length > 0 && (
              <LayoutContainer className="bg-surface border border-border rounded-2xl p-4 flex flex-wrap gap-2">
                {counter.searchResults.map((v) => (
                  <Button
                    key={v.id || v.sku}
                    type="button"
                    variant="outline"
                    disabled={!v.id || (v.availableStock ?? 0) <= 0}
                    onClick={() => counter.addVariantToCounter(v)}
                    className="px-3 py-1.5 text-xs"
                  >
                    {v.productName} ({v.sizeLabel}) · {formatCurrencyBrl(v.salePrice)} ·{' '}
                    {v.availableStock ?? 0} disp.
                  </Button>
                ))}
              </LayoutContainer>
            )}

            {counter.cartLines.length === 0 ? (
              <LayoutContainer className="bg-surface border border-border rounded-2xl p-10 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-primary mx-auto opacity-80" />
                <Text className="text-sm text-text-secondary">{PDV_TEXTS.COUNTER_EMPTY_CART}</Text>
              </LayoutContainer>
            ) : (
              <LayoutContainer className="space-y-3">
                {counter.cartLines.map((line) => (
                  <LayoutContainer
                    key={line.variantId}
                    className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between gap-3"
                  >
                    <LayoutContainer className="flex-1 space-y-0.5">
                      <Text className="text-sm font-bold text-text-primary">
                        {line.productName} ({line.sizeLabel})
                      </Text>
                      <Text className="text-xs text-text-secondary">
                        {line.sku} · {formatCurrencyBrl(line.salePrice)}
                        {line.memberPrice != null ? ` / Sócio ${formatCurrencyBrl(line.memberPrice)}` : ''}
                      </Text>
                    </LayoutContainer>

                    <Input
                      type="number"
                      min={1}
                      max={line.availableStock}
                      value={line.quantity}
                      onChange={(e) => counter.updateCartQty(line.variantId, Number(e.target.value) || 1)}
                      className="w-20 text-center py-1"
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => counter.removeCartLine(line.variantId)}
                      className="text-[#ea580c] p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </LayoutContainer>
                ))}
              </LayoutContainer>
            )}
          </LayoutContainer>

          {/* Direita: Cliente + Totais + Múltiplos Pagamentos */}
          <Form
            onSubmit={counter.handleSubmitSale}
            className="lg:col-span-5 bg-surface border border-border rounded-2xl p-5 sm:p-6 space-y-5"
          >
            <LayoutContainer className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={counter.customerMode === 'ANON' ? 'primary' : 'outline'}
                onClick={() => counter.handleSwitchMode('ANON')}
                className="flex-1 text-xs py-2"
              >
                {PDV_TEXTS.COUNTER_MODE_ANON}
              </Button>
              <Button
                type="button"
                variant={counter.customerMode === 'CPF' ? 'primary' : 'outline'}
                onClick={() => counter.handleSwitchMode('CPF')}
                className="flex-1 text-xs py-2"
              >
                {PDV_TEXTS.COUNTER_MODE_CPF}
              </Button>
            </LayoutContainer>

            {counter.customerMode === 'CPF' && (
              <LayoutContainer className="space-y-3 p-3.5 rounded-xl bg-background border border-border">
                <LayoutContainer className="flex gap-2">
                  <Input
                    value={counter.customerCpf}
                    onChange={(e) => counter.setCustomerCpf(e.target.value)}
                    placeholder={PDV_TEXTS.COUNTER_CPF_PLACEHOLDER}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={counter.isCheckingCpf}
                    onClick={counter.handleCheckCpf}
                    className="text-xs shrink-0"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    {PDV_TEXTS.COUNTER_CPF_CHECK_BTN}
                  </Button>
                </LayoutContainer>

                {counter.memberInfo && (
                  <Badge variant={counter.memberInfo.isSocioActive ? 'success' : 'default'}>
                    {counter.memberInfo.isSocioActive
                      ? PDV_TEXTS.COUNTER_SOCIO_ACTIVE_MSG
                      : PDV_TEXTS.COUNTER_SOCIO_INACTIVE_MSG}
                  </Badge>
                )}

                <FormField label={PDV_TEXTS.COUNTER_CUSTOMER_NAME_LABEL}>
                  <Input
                    value={counter.customerName}
                    onChange={(e) => counter.setCustomerName(e.target.value)}
                  />
                </FormField>
              </LayoutContainer>
            )}

            <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label={PDV_TEXTS.EDITOR_DISCOUNT_LABEL}>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={counter.discountAmount}
                  onChange={(e) => counter.setDiscountAmount(e.target.value)}
                />
              </FormField>

              <FormField label={PDV_TEXTS.EDITOR_NOTES_LABEL}>
                <Input value={counter.notes} onChange={(e) => counter.setNotes(e.target.value)} />
              </FormField>
            </LayoutContainer>

            <LayoutContainer className="border-t border-b border-border py-3 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={counter.fillFullTotalPayment}
                className="px-2 py-1 text-xs"
              >
                {PDV_TEXTS.CHECKOUT_TOTAL_LABEL}
              </Button>
              <Text className="text-xl font-extrabold text-primary">
                {formatCurrencyBrl(counter.totals.total)}
              </Text>
            </LayoutContainer>

            <PaymentLinesBuilder
              totalAmount={counter.totals.total}
              payments={counter.payments}
              disabled={counter.isSubmitting}
              onAddLine={counter.addPaymentLine}
              onRemoveLine={counter.removePaymentLine}
              onUpdateLine={counter.updatePaymentLine}
            />

            <Button
              type="submit"
              variant="primary"
              disabled={counter.isSubmitting || counter.cartLines.length === 0}
              className="w-full"
            >
              {counter.isSubmitting ? PDV_TEXTS.BTN_SAVING : PDV_TEXTS.COUNTER_SUBMIT_BTN}
            </Button>
          </Form>
        </LayoutContainer>
      </LayoutContainer>

      <OrderReceiptModal
        order={counter.receiptOrder}
        onClose={() => counter.setReceiptOrder(null)}
      />
    </PdvShell>
  );
};
