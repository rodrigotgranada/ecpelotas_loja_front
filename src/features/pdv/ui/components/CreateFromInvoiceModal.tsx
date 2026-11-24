'use client';

import React from 'react';
import {
  Modal,
  Form,
  FormField,
  Input,
  Select,
  SelectOption,
  Button,
  LayoutContainer,
} from '@/shared/ui/components';
import { CategoryItem, StockDocumentItem } from '../../services/pdv.service';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { CreateFromInvoiceFormState } from '../../hooks/usePdvInvoices';

export interface CreateFromInvoiceModalProps {
  item: StockDocumentItem | null;
  categories: CategoryItem[];
  formState: CreateFromInvoiceFormState;
  isSubmitting: boolean;
  onChangeField: <K extends keyof CreateFromInvoiceFormState>(
    field: K,
    value: CreateFromInvoiceFormState[K],
  ) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const CreateFromInvoiceModal = ({
  item,
  categories,
  formState,
  isSubmitting,
  onChangeField,
  onClose,
  onSubmit,
}: CreateFromInvoiceModalProps) => {
  return (
    <Modal
      isOpen={Boolean(item)}
      onClose={onClose}
      title={PDV_TEXTS.CREATE_FROM_INVOICE_TITLE}
      maxWidthClass="max-w-xl"
    >
      {item && (
        <Form onSubmit={onSubmit} className="space-y-4">
          <FormField label={PDV_TEXTS.FIELD_NAME} required>
            <Input
              value={formState.productName}
              onChange={(e) => onChangeField('productName', e.target.value)}
              disabled={isSubmitting}
            />
          </FormField>

          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label={PDV_TEXTS.FIELD_CATEGORY}>
              <Select
                value={formState.categoryId}
                onChange={(e) => onChangeField('categoryId', e.target.value)}
                disabled={isSubmitting}
              >
                <SelectOption value="">{PDV_TEXTS.PRODUCTS_CATEGORY_NONE}</SelectOption>
                {categories.map((cat) => (
                  <SelectOption key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectOption>
                ))}
              </Select>
            </FormField>

            <FormField label={PDV_TEXTS.FIELD_SKU} required>
              <Input
                value={formState.sku}
                onChange={(e) => onChangeField('sku', e.target.value)}
                disabled={isSubmitting}
              />
            </FormField>
          </LayoutContainer>

          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField label={PDV_TEXTS.FIELD_EAN}>
              <Input
                value={formState.eanBarcode}
                onChange={(e) => onChangeField('eanBarcode', e.target.value)}
                disabled={isSubmitting}
              />
            </FormField>

            <FormField label={PDV_TEXTS.FIELD_SIZE} required>
              <Input
                value={formState.sizeLabel}
                onChange={(e) => onChangeField('sizeLabel', e.target.value)}
                disabled={isSubmitting}
              />
            </FormField>

            <FormField label={PDV_TEXTS.FIELD_COLOR}>
              <Input
                value={formState.colorLabel}
                onChange={(e) => onChangeField('colorLabel', e.target.value)}
                disabled={isSubmitting}
              />
            </FormField>
          </LayoutContainer>

          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label={PDV_TEXTS.FIELD_PRICE} required>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={formState.salePrice}
                onChange={(e) => onChangeField('salePrice', e.target.value)}
                disabled={isSubmitting}
              />
            </FormField>

            <FormField label={PDV_TEXTS.FIELD_MEMBER_PRICE}>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formState.memberPrice}
                onChange={(e) => onChangeField('memberPrice', e.target.value)}
                disabled={isSubmitting}
              />
            </FormField>
          </LayoutContainer>

          <LayoutContainer className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              {PDV_TEXTS.BTN_CANCEL}
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? PDV_TEXTS.BTN_SAVING : PDV_TEXTS.CREATE_FROM_INVOICE_SUBMIT}
            </Button>
          </LayoutContainer>
        </Form>
      )}
    </Modal>
  );
};
