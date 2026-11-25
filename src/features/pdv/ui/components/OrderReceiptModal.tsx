'use client';

import React from 'react';
import { Printer } from 'lucide-react';
import { Modal, LayoutContainer, Title, Text, Button } from '@/shared/ui/components';
import { AdminOrderDto } from '../../services/pdv.service';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { formatCurrencyBrl, formatDateTimeBrt } from '../../utils/pdv.formatters';

export interface OrderReceiptModalProps {
  order: AdminOrderDto | null;
  onClose: () => void;
}

export const OrderReceiptModal = ({ order, onClose }: OrderReceiptModalProps) => {
  return (
    <Modal isOpen={Boolean(order)} onClose={onClose} title={PDV_TEXTS.RECEIPT_TITLE}>
      {order && (
        <LayoutContainer className="space-y-4">
          <LayoutContainer className="p-4 rounded-xl bg-background border border-border space-y-2 text-xs font-mono">
            <Title level="h3" className="text-sm font-bold text-text-primary">
              {order.orderCode} · {order.channel}
            </Title>
            <Text className="text-xs text-text-secondary">
              {formatDateTimeBrt(order.confirmedAt || order.createdAt)}
            </Text>
            <Text className="text-xs text-text-primary">{order.customerName}</Text>

            <LayoutContainer className="border-t border-border pt-2 space-y-1">
              {order.items.map((item) => (
                <LayoutContainer key={item.id} className="flex justify-between gap-2">
                  <Text as="span" className="text-xs text-text-primary">
                    {item.quantity}x {item.productName} ({item.sizeLabel})
                  </Text>
                  <Text as="span" className="text-xs font-semibold text-text-primary">
                    {formatCurrencyBrl(item.lineTotal)}
                  </Text>
                </LayoutContainer>
              ))}
            </LayoutContainer>

            {order.payments.length > 0 && (
              <LayoutContainer className="border-t border-border pt-2 space-y-1">
                {order.payments.map((pay, idx) => (
                  <LayoutContainer key={pay.id || `p-${idx}`} className="flex justify-between">
                    <Text as="span" className="text-xs text-text-secondary">
                      {pay.paymentMethod}
                    </Text>
                    <Text as="span" className="text-xs text-text-primary">
                      {formatCurrencyBrl(pay.amount)}
                    </Text>
                  </LayoutContainer>
                ))}
              </LayoutContainer>
            )}

            <LayoutContainer className="border-t border-border pt-2 flex justify-between font-bold">
              <Text as="span" className="text-sm text-text-primary">
                {PDV_TEXTS.CHECKOUT_TOTAL_LABEL}
              </Text>
              <Text as="span" className="text-sm text-primary">
                {formatCurrencyBrl(order.totalAmount)}
              </Text>
            </LayoutContainer>
          </LayoutContainer>

          <LayoutContainer className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              {PDV_TEXTS.RECEIPT_CLOSE_BTN}
            </Button>
            <Button type="button" variant="primary" onClick={() => window.print()}>
              <Printer className="w-4 h-4" />
              {PDV_TEXTS.RECEIPT_PRINT_BTN}
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      )}
    </Modal>
  );
};
