'use client';

import React from 'react';
import { Pencil } from 'lucide-react';
import {
  Modal,
  Form,
  FormField,
  Input,
  Button,
  LayoutContainer,
  Text,
} from '@/shared/ui/components';
import { CategoryItem } from '../../services/pdv.service';
import { PDV_TEXTS } from '../../constants/pdv.constants';

export interface CategoryManagerModalProps {
  isOpen: boolean;
  categories: CategoryItem[];
  editingId: string | null;
  name: string;
  onChangeName: (v: string) => void;
  description: string;
  onChangeDescription: (v: string) => void;
  sortOrder: string;
  onChangeSortOrder: (v: string) => void;
  isSaving: boolean;
  onSelectEdit: (cat: CategoryItem) => void;
  onResetForm: () => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const CategoryManagerModal = ({
  isOpen,
  categories,
  editingId,
  name,
  onChangeName,
  description,
  onChangeDescription,
  sortOrder,
  onChangeSortOrder,
  isSaving,
  onSelectEdit,
  onResetForm,
  onClose,
  onSubmit,
}: CategoryManagerModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={PDV_TEXTS.CATEGORIES_MODAL_TITLE}
      maxWidthClass="max-w-xl"
    >
      <LayoutContainer className="space-y-5">
        <LayoutContainer className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <LayoutContainer
              key={cat.id}
              className="p-3 rounded-xl bg-background border border-border flex items-center justify-between gap-3"
            >
              <LayoutContainer className="space-y-0.5">
                <Text className="text-sm font-bold text-text-primary">{cat.name}</Text>
                {cat.description && (
                  <Text className="text-xs text-text-secondary">{cat.description}</Text>
                )}
              </LayoutContainer>
              <Button
                type="button"
                variant="outline"
                onClick={() => onSelectEdit(cat)}
                className="px-2.5 py-1 text-xs shrink-0"
              >
                <Pencil className="w-3.5 h-3.5" />
                {PDV_TEXTS.PRODUCTS_EDIT_BTN}
              </Button>
            </LayoutContainer>
          ))}
        </LayoutContainer>

        <Form onSubmit={onSubmit} className="space-y-3 border-t border-border pt-4">
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <LayoutContainer className="sm:col-span-3">
              <FormField label={PDV_TEXTS.CATEGORIES_FIELD_NAME} required>
                <Input
                  value={name}
                  onChange={(e) => onChangeName(e.target.value)}
                  disabled={isSaving}
                />
              </FormField>
            </LayoutContainer>

            <FormField label={PDV_TEXTS.CATEGORIES_FIELD_ORDER}>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => onChangeSortOrder(e.target.value)}
                disabled={isSaving}
              />
            </FormField>
          </LayoutContainer>

          <FormField label={PDV_TEXTS.CATEGORIES_FIELD_DESC}>
            <Input
              value={description}
              onChange={(e) => onChangeDescription(e.target.value)}
              disabled={isSaving}
            />
          </FormField>

          <LayoutContainer className="flex justify-end gap-2 pt-2">
            {editingId && (
              <Button type="button" variant="ghost" onClick={onResetForm} disabled={isSaving}>
                {PDV_TEXTS.CATEGORIES_NEW_SUBTITLE}
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              {PDV_TEXTS.BTN_CANCEL}
            </Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving
                ? PDV_TEXTS.BTN_SAVING
                : editingId
                  ? PDV_TEXTS.CATEGORIES_BTN_UPDATE
                  : PDV_TEXTS.CATEGORIES_BTN_CREATE}
            </Button>
          </LayoutContainer>
        </Form>
      </LayoutContainer>
    </Modal>
  );
};
