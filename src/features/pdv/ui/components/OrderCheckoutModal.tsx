'use client';

import React from 'react';
import { Modal, Form, FormField, Input, Button, LayoutContainer, Text } from '@/shared/ui/components';
import { AdminOrderDto } from '../../services/pdv.service';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { formatCurrencyBrl } from '../../utils/pdv.formatters';
import { PaymentLinesBuilder, PaymentLineInput } from './PaymentLinesBuilder';

export interface OrderCheckoutModalProps {
  order: AdminOrderDto | null;
  payments: PaymentLineInput[];
  notes: string;
  isSubmitting: boolean;
  onChangeNotes: (value: string) => void;
  onAddPaymentLine: () => void;
  onRemovePaymentLine: (index: number) => void;
  onUpdatePaymentLine: (index: number, field: keyof PaymentLineInput, value: string) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const OrderCheckoutModal = ({
  order,
  payments,
  notes,
  isSubmitting,
  onChangeNotes,
  onAddPaymentLine,
  onRemovePaymentLine,
  onUpdatePaymentLine,
  onClose,
  onSubmit,
}: OrderCheckoutModalProps) => {
  return (
    <Modal
      isOpen={Boolean(order)}
      onClose={onClose}
      title={PDV_TEXTS.CHECKOUT_TITLE}
      maxWidthClass="max-w-xl"
    >
      {order && (
        <Form onSubmit={onSubmit} className="space-y-4">
          <LayoutContainer className="p-3.5 rounded-xl bg-background border border-border flex items-center justify-between">
            <Text className="text-sm font-bold text-text-primary">
              {order.orderCode} · {order.customerName}
            </Text>
            <Text className="text-base font-extrabold text-primary">
              {formatCurrencyBrl(order.totalAmount)}
            </Text>
          </LayoutContainer>

          <PaymentLinesBuilder
            totalAmount={Number(order.totalAmount)}
            payments={payments}
            disabled={isSubmitting}
            onAddLine={onAddPaymentLine}
            onRemoveLine={onRemovePaymentLine}
            onUpdateLine={onUpdatePaymentLine}
          />

          <FormField label={PDV_TEXTS.EDITOR_NOTES_LABEL}>
            <Input
              value={notes}
              onChange={(e) => onChangeNotes(e.target.value)}
              disabled={isSubmitting}
            />
          </FormField>

          <LayoutContainer className="flex justify-end gap-3 pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              {PDV_TEXTS.BTN_CANCEL}
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? PDV_TEXTS.BTN_SAVING : PDV_TEXTS.CHECKOUT_SUBMIT_BTN}
            </Button>
          </LayoutContainer>
        </Form>
      )}
    </Modal>
  );
};
