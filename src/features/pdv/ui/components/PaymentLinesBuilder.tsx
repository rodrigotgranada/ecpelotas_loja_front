'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  LayoutContainer,
  Text,
  Button,
  Input,
  Select,
  SelectOption,
  FormField,
} from '@/shared/ui/components';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { formatCurrencyBrl } from '../../utils/pdv.formatters';

export interface PaymentLineInput {
  paymentMethod: string;
  amount: string;
}

export interface PaymentLinesBuilderProps {
  totalAmount: number;
  payments: PaymentLineInput[];
  disabled?: boolean;
  onAddLine: () => void;
  onRemoveLine: (index: number) => void;
  onUpdateLine: (index: number, field: keyof PaymentLineInput, value: string) => void;
}

const PAYMENT_OPTIONS = [
  { value: 'PIX', label: PDV_TEXTS.PAY_PIX },
  { value: 'CASH', label: PDV_TEXTS.PAY_CASH },
  { value: 'CREDIT', label: PDV_TEXTS.PAY_CREDIT },
  { value: 'DEBIT', label: PDV_TEXTS.PAY_DEBIT },
  { value: 'COMPLIMENTARY', label: PDV_TEXTS.PAY_COMPLIMENTARY },
] as const;

export const PaymentLinesBuilder = ({
  totalAmount,
  payments,
  disabled,
  onAddLine,
  onRemoveLine,
  onUpdateLine,
}: PaymentLinesBuilderProps) => {
  const paidSum = payments.reduce((sum, line) => sum + (Number(line.amount) || 0), 0);
  const diff = Number((totalAmount - paidSum).toFixed(2));

  return (
    <LayoutContainer className="space-y-3">
      <LayoutContainer className="flex flex-wrap items-center justify-between gap-2">
        <Text className="text-xs font-bold uppercase tracking-wide text-text-secondary">
          {PDV_TEXTS.CHECKOUT_PAYMENTS_TITLE}
        </Text>
        <Button
          type="button"
          variant="outline"
          onClick={onAddLine}
          disabled={disabled}
          className="px-2.5 py-1 text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          {PDV_TEXTS.CHECKOUT_ADD_PAYMENT}
        </Button>
      </LayoutContainer>

      <LayoutContainer className="space-y-2.5">
        {payments.map((line, idx) => (
          <LayoutContainer
            key={`pay-${idx}`}
            className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end bg-background p-3 rounded-xl border border-border"
          >
            <LayoutContainer className="sm:col-span-6">
              <FormField label={PDV_TEXTS.CHECKOUT_METHOD_LABEL}>
                <Select
                  value={line.paymentMethod}
                  onChange={(e) => onUpdateLine(idx, 'paymentMethod', e.target.value)}
                  disabled={disabled}
                >
                  {PAYMENT_OPTIONS.map((opt) => (
                    <SelectOption key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectOption>
                  ))}
                </Select>
              </FormField>
            </LayoutContainer>

            <LayoutContainer className="sm:col-span-4">
              <FormField label={PDV_TEXTS.CHECKOUT_AMOUNT_LABEL}>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={line.amount}
                  onChange={(e) => onUpdateLine(idx, 'amount', e.target.value)}
                  disabled={disabled}
                />
              </FormField>
            </LayoutContainer>

            <LayoutContainer className="sm:col-span-2 flex justify-end">
              {payments.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onRemoveLine(idx)}
                  disabled={disabled}
                  className="text-[#ea580c] p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </LayoutContainer>
          </LayoutContainer>
        ))}
      </LayoutContainer>

      <LayoutContainer className="flex items-center justify-between text-xs pt-1">
        <Text as="span" className="text-text-secondary">
          {PDV_TEXTS.CHECKOUT_TOTAL_LABEL} {formatCurrencyBrl(totalAmount)}
        </Text>
        <Text
          as="span"
          className={`font-bold ${Math.abs(diff) <= 0.009 ? 'text-success' : 'text-[#ea580c]'}`}
        >
          {formatCurrencyBrl(paidSum)}
        </Text>
      </LayoutContainer>
    </LayoutContainer>
  );
};
