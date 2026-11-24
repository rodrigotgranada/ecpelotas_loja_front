'use client';

import React from 'react';
import {
  Modal,
  Form,
  FormField,
  Input,
  Button,
  LayoutContainer,
  Text,
} from '@/shared/ui/components';
import { ProductVariantItem } from '../../services/pdv.service';
import { PDV_TEXTS } from '../../constants/pdv.constants';

export interface StockAdjustModalProps {
  variant: ProductVariantItem | null;
  delta: string;
  onChangeDelta: (value: string) => void;
  reason: string;
  onChangeReason: (value: string) => void;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const StockAdjustModal = ({
  variant,
  delta,
  onChangeDelta,
  reason,
  onChangeReason,
  isSubmitting,
  onClose,
  onSubmit,
}: StockAdjustModalProps) => {
  return (
    <Modal isOpen={Boolean(variant)} onClose={onClose} title={PDV_TEXTS.ADJUST_TITLE}>
      {variant && (
        <Form onSubmit={onSubmit} className="space-y-4">
          <LayoutContainer className="p-3.5 rounded-xl bg-background border border-border space-y-1">
            <Text className="text-sm font-bold text-text-primary">
              {variant.productName} · {variant.sizeLabel} ({variant.sku})
            </Text>
            <Text className="text-xs text-text-secondary">
              {PDV_TEXTS.ADJUST_CURRENT_STOCK}: {variant.physicalStock ?? 0} / {variant.availableStock ?? 0}
            </Text>
          </LayoutContainer>

          <FormField label={PDV_TEXTS.ADJUST_DELTA_LABEL} required>
            <Input
              type="number"
              step="1"
              value={delta}
              onChange={(e) => onChangeDelta(e.target.value)}
              disabled={isSubmitting}
            />
          </FormField>

          <FormField label={PDV_TEXTS.ADJUST_REASON_LABEL} required>
            <Input
              value={reason}
              onChange={(e) => onChangeReason(e.target.value)}
              placeholder={PDV_TEXTS.ADJUST_REASON_PLACEHOLDER}
              disabled={isSubmitting}
            />
          </FormField>

          <LayoutContainer className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              {PDV_TEXTS.BTN_CANCEL}
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? PDV_TEXTS.BTN_SAVING : PDV_TEXTS.ADJUST_SUBMIT_BTN}
            </Button>
          </LayoutContainer>
        </Form>
      )}
    </Modal>
  );
};
