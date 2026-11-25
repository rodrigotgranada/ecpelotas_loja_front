'use client';

import React from 'react';
import { Copy, CheckCircle2, Pencil, RotateCcw, XCircle, Printer, Play } from 'lucide-react';
import { LayoutContainer, Title, Text, Badge, Button } from '@/shared/ui/components';
import { AdminOrderDto } from '../../services/pdv.service';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { formatCurrencyBrl, formatDateTimeBrt } from '../../utils/pdv.formatters';

export interface OrderDetailPanelProps {
  order: AdminOrderDto | null;
  isBusy: boolean;
  onStartNegotiating: () => void;
  onOpenEditor: () => void;
  onCopyWhatsapp: () => void;
  onOpenCheckout: () => void;
  onReactivate: () => void;
  onCancelOrder: () => void;
  onOpenReceipt: () => void;
}

export const OrderDetailPanel = ({
  order,
  isBusy,
  onStartNegotiating,
  onOpenEditor,
  onCopyWhatsapp,
  onOpenCheckout,
  onReactivate,
  onCancelOrder,
  onOpenReceipt,
}: OrderDetailPanelProps) => {
  if (!order) {
    return (
      <LayoutContainer className="lg:col-span-8 bg-surface border border-border rounded-2xl p-6">
        <Text className="text-sm text-text-secondary">{PDV_TEXTS.SALES_SELECT_PROMPT}</Text>
      </LayoutContainer>
    );
  }

  const isPending = order.status === 'PENDING_WHATSAPP';
  const isNegotiating = order.status === 'NEGOTIATING';
  const isEditable = isPending || isNegotiating;
  const isExpired = order.status === 'EXPIRED';

  return (
    <LayoutContainer className="lg:col-span-8 bg-surface border border-border rounded-2xl p-5 sm:p-6 space-y-5">
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-4">
        <LayoutContainer className="space-y-1">
          <LayoutContainer className="flex flex-wrap items-center gap-2">
            <Title level="h2" className="text-xl font-extrabold text-text-primary">
              {order.orderCode}
            </Title>
            <Badge variant={order.status === 'CONFIRMED_PAID' ? 'success' : 'warning'}>
              {order.status}
            </Badge>
            <Badge variant="default">{order.channel}</Badge>
          </LayoutContainer>
          <Text className="text-xs text-text-secondary">
            {order.customerName}
            {order.customerCpf ? ` · CPF: ${order.customerCpf}` : ''}
            {order.customerWhatsapp ? ` · WhatsApp: ${order.customerWhatsapp}` : ''}
          </Text>
          {order.expiresAt && isEditable && (
            <Text className="text-xs text-warning">
              {formatDateTimeBrt(order.expiresAt)}
            </Text>
          )}
        </LayoutContainer>

        <LayoutContainer className="text-left sm:text-right">
          <Text className="text-xs text-text-secondary">
            {formatCurrencyBrl(order.subtotalAmount)} · - {formatCurrencyBrl(order.discountAmount)}
          </Text>
          <Text className="text-xl font-extrabold text-primary">
            {formatCurrencyBrl(order.totalAmount)}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      <LayoutContainer className="flex flex-wrap gap-2">
        {isPending && (
          <Button variant="primary" disabled={isBusy} onClick={onStartNegotiating} className="text-xs">
            <Play className="w-3.5 h-3.5" />
            {PDV_TEXTS.SALES_BTN_ASSUME}
          </Button>
        )}
        {isEditable && (
          <>
            <Button variant="outline" disabled={isBusy} onClick={onOpenEditor} className="text-xs">
              <Pencil className="w-3.5 h-3.5" />
              {PDV_TEXTS.SALES_BTN_EDIT_ITEMS}
            </Button>
            {order.whatsappSummaryText && (
              <Button variant="outline" disabled={isBusy} onClick={onCopyWhatsapp} className="text-xs">
                <Copy className="w-3.5 h-3.5" />
                {PDV_TEXTS.SALES_BTN_COPY_WA}
              </Button>
            )}
            <Button variant="primary" disabled={isBusy} onClick={onOpenCheckout} className="text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {PDV_TEXTS.SALES_BTN_CONFIRM_PAY}
            </Button>
            <Button
              variant="outline"
              disabled={isBusy}
              onClick={onCancelOrder}
              className="text-xs text-[#ea580c]"
            >
              <XCircle className="w-3.5 h-3.5" />
              {PDV_TEXTS.SALES_BTN_CANCEL}
            </Button>
          </>
        )}
        {isExpired && (
          <Button variant="primary" disabled={isBusy} onClick={onReactivate} className="text-xs">
            <RotateCcw className="w-3.5 h-3.5" />
            {PDV_TEXTS.SALES_BTN_REACTIVATE}
          </Button>
        )}
        {order.status === 'CONFIRMED_PAID' && (
          <Button variant="outline" onClick={onOpenReceipt} className="text-xs">
            <Printer className="w-3.5 h-3.5" />
            {PDV_TEXTS.SALES_BTN_RECEIPT}
          </Button>
        )}
      </LayoutContainer>

      <LayoutContainer className="space-y-2">
        {order.items.map((item) => (
          <LayoutContainer
            key={item.id}
            className="p-3 rounded-xl bg-background border border-border flex items-center justify-between gap-2"
          >
            <Text className="text-sm text-text-primary">
              {item.quantity}x {item.productName} ({item.sizeLabel} · {item.sku})
            </Text>
            <Text className="text-sm font-bold text-text-primary">
              {formatCurrencyBrl(item.lineTotal)}
            </Text>
          </LayoutContainer>
        ))}
      </LayoutContainer>

      {order.payments.length > 0 && (
        <LayoutContainer className="flex flex-wrap gap-2">
          {order.payments.map((pay, idx) => (
            <Badge key={pay.id || `pay-${idx}`} variant="success">
              {pay.paymentMethod}: {formatCurrencyBrl(pay.amount)}
            </Badge>
          ))}
        </LayoutContainer>
      )}

      {order.events && order.events.length > 0 && (
        <LayoutContainer className="border-t border-border pt-4 space-y-2">
          <Text className="text-xs font-bold uppercase tracking-wide text-text-secondary">
            {PDV_TEXTS.SALES_EVENTS_TITLE}
          </Text>
          {order.events.map((ev) => (
            <Text key={ev.id} className="text-xs text-text-secondary">
              {formatDateTimeBrt(ev.createdAt)} · {ev.eventType} ({ev.actorName || '-'}): {ev.description}
            </Text>
          ))}
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
