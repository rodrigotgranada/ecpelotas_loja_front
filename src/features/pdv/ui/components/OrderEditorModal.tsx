'use client';

import React from 'react';
import { Search, Trash2 } from 'lucide-react';
import {
  Modal,
  Form,
  FormField,
  Input,
  Button,
  LayoutContainer,
  Text,
} from '@/shared/ui/components';
import { AdminOrderDto, ProductVariantItem } from '../../services/pdv.service';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { formatCurrencyBrl } from '../../utils/pdv.formatters';

export interface EditableOrderLine {
  variantId: string;
  productName: string;
  sku: string;
  sizeLabel: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderEditorModalProps {
  order: AdminOrderDto | null;
  lines: EditableOrderLine[];
  discountAmount: string;
  notes: string;
  searchQuery: string;
  searchResults: ProductVariantItem[];
  isSubmitting: boolean;
  onChangeDiscount: (v: string) => void;
  onChangeNotes: (v: string) => void;
  onChangeSearch: (v: string) => void;
  onSearchVariants: () => void;
  onAddVariant: (variant: ProductVariantItem) => void;
  onChangeLineQty: (variantId: string, qty: number) => void;
  onRemoveLine: (variantId: string) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const OrderEditorModal = ({
  order,
  lines,
  discountAmount,
  notes,
  searchQuery,
  searchResults,
  isSubmitting,
  onChangeDiscount,
  onChangeNotes,
  onChangeSearch,
  onSearchVariants,
  onAddVariant,
  onChangeLineQty,
  onRemoveLine,
  onClose,
  onSubmit,
}: OrderEditorModalProps) => {
  return (
    <Modal
      isOpen={Boolean(order)}
      onClose={onClose}
      title={PDV_TEXTS.EDITOR_ORDER_TITLE}
      maxWidthClass="max-w-2xl"
    >
      {order && (
        <Form onSubmit={onSubmit} className="space-y-4">
          <LayoutContainer className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => onChangeSearch(e.target.value)}
              placeholder={PDV_TEXTS.EDITOR_SEARCH_SKU}
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="outline"
              onClick={onSearchVariants}
              disabled={isSubmitting}
              className="shrink-0"
            >
              <Search className="w-4 h-4" />
              {PDV_TEXTS.INVOICES_BTN_SEARCH}
            </Button>
          </LayoutContainer>

          {searchResults.length > 0 && (
            <LayoutContainer className="flex flex-wrap gap-2 p-3 rounded-xl bg-background border border-border">
              {searchResults.map((v) => (
                <Button
                  key={v.id || v.sku}
                  type="button"
                  variant="outline"
                  disabled={!v.id || (v.availableStock ?? 0) <= 0}
                  onClick={() => onAddVariant(v)}
                  className="px-2.5 py-1 text-xs"
                >
                  {v.productName} ({v.sizeLabel}) · {v.availableStock ?? 0} disp.
                </Button>
              ))}
            </LayoutContainer>
          )}

          <LayoutContainer className="space-y-2 max-h-60 overflow-y-auto">
            {lines.map((line) => (
              <LayoutContainer
                key={line.variantId}
                className="p-3 rounded-xl bg-background border border-border flex items-center justify-between gap-3"
              >
                <LayoutContainer className="flex-1 space-y-0.5">
                  <Text className="text-sm font-bold text-text-primary">
                    {line.productName} ({line.sizeLabel})
                  </Text>
                  <Text className="text-xs text-text-secondary">
                    {line.sku} · {formatCurrencyBrl(line.unitPrice)}
                  </Text>
                </LayoutContainer>

                <Input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => onChangeLineQty(line.variantId, Number(e.target.value) || 1)}
                  disabled={isSubmitting}
                  className="w-20 text-center py-1"
                />

                {lines.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onRemoveLine(line.variantId)}
                    disabled={isSubmitting}
                    className="text-[#ea580c] p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </LayoutContainer>
            ))}
          </LayoutContainer>

          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label={PDV_TEXTS.EDITOR_DISCOUNT_LABEL}>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={discountAmount}
                onChange={(e) => onChangeDiscount(e.target.value)}
                disabled={isSubmitting}
              />
            </FormField>

            <FormField label={PDV_TEXTS.EDITOR_NOTES_LABEL}>
              <Input
                value={notes}
                onChange={(e) => onChangeNotes(e.target.value)}
                disabled={isSubmitting}
              />
            </FormField>
          </LayoutContainer>

          <LayoutContainer className="flex justify-end gap-3 pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              {PDV_TEXTS.BTN_CANCEL}
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? PDV_TEXTS.BTN_SAVING : PDV_TEXTS.EDITOR_BTN_SAVE}
            </Button>
          </LayoutContainer>
        </Form>
      )}
    </Modal>
  );
};
