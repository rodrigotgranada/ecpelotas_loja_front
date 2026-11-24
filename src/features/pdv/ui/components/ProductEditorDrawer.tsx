'use client';

import React from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react';
import {
  Drawer,
  Form,
  FormField,
  Input,
  Textarea,
  Select,
  SelectOption,
  Button,
  LayoutContainer,
  Title,
  Text,
  SafeImage,
} from '@/shared/ui/components';
import { CategoryItem, ProductVariantItem } from '../../services/pdv.service';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { ProductEditorFormState } from '../../hooks/usePdvProducts';

export interface ProductEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  editingProductId: string | null;
  categories: CategoryItem[];
  formState: ProductEditorFormState;
  isUploadingImage: boolean;
  isSavingProduct: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onUpdateField: <K extends keyof ProductEditorFormState>(
    field: K,
    value: ProductEditorFormState[K],
  ) => void;
  onAddVariant: () => void;
  onRemoveVariant: (index: number) => void;
  onUpdateVariant: <K extends keyof ProductVariantItem>(
    index: number,
    field: K,
    value: ProductVariantItem[K],
  ) => void;
  onSelectImageClick: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const ProductEditorDrawer = ({
  isOpen,
  onClose,
  editingProductId,
  categories,
  formState,
  isUploadingImage,
  isSavingProduct,
  fileInputRef,
  onUpdateField,
  onAddVariant,
  onRemoveVariant,
  onUpdateVariant,
  onSelectImageClick,
  onFileChange,
  onSubmit,
}: ProductEditorDrawerProps) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={editingProductId ? PDV_TEXTS.DRAWER_EDIT_TITLE : PDV_TEXTS.DRAWER_CREATE_TITLE}
    >
      <Form onSubmit={onSubmit} className="space-y-5">
        <FormField label={PDV_TEXTS.FIELD_NAME} required>
          <Input
            value={formState.name}
            onChange={(e) => onUpdateField('name', e.target.value)}
            disabled={isSavingProduct}
          />
        </FormField>

        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label={PDV_TEXTS.FIELD_CATEGORY}>
            <Select
              value={formState.categoryId}
              onChange={(e) => onUpdateField('categoryId', e.target.value)}
              disabled={isSavingProduct}
            >
              <SelectOption value="">{PDV_TEXTS.PRODUCTS_CATEGORY_NONE}</SelectOption>
              {categories.map((cat) => (
                <SelectOption key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectOption>
              ))}
            </Select>
          </FormField>

          <FormField label={PDV_TEXTS.FIELD_BRAND}>
            <Input
              value={formState.brand}
              onChange={(e) => onUpdateField('brand', e.target.value)}
              disabled={isSavingProduct}
            />
          </FormField>
        </LayoutContainer>

        <FormField label={PDV_TEXTS.FIELD_DESCRIPTION}>
          <Textarea
            rows={3}
            value={formState.description}
            onChange={(e) => onUpdateField('description', e.target.value)}
            disabled={isSavingProduct}
          />
        </FormField>

        <FormField label={PDV_TEXTS.FIELD_COVER_IMAGE}>
          <LayoutContainer className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <SafeImage
              src={formState.coverImageUrl}
              alt={formState.name || PDV_TEXTS.FIELD_COVER_IMAGE}
              className="w-20 h-20 rounded-xl object-cover border border-border shrink-0"
            />
            <LayoutContainer className="flex-1 w-full space-y-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={onFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={onSelectImageClick}
                disabled={isUploadingImage || isSavingProduct}
                className="text-xs"
              >
                <Upload className="w-4 h-4" />
                {isUploadingImage ? PDV_TEXTS.BTN_UPLOADING_IMAGE : PDV_TEXTS.BTN_UPLOAD_IMAGE}
              </Button>
            </LayoutContainer>
          </LayoutContainer>
        </FormField>

        <LayoutContainer className="flex flex-wrap gap-5 pt-1">
          <LayoutContainer className="flex items-center gap-2">
            <Input
              type="checkbox"
              checked={formState.featured}
              onChange={(e) => onUpdateField('featured', e.target.checked)}
              className="w-4 h-4"
            />
            <Text as="span" className="text-xs text-text-primary">
              {PDV_TEXTS.FIELD_FEATURED}
            </Text>
          </LayoutContainer>

          <LayoutContainer className="flex items-center gap-2">
            <Input
              type="checkbox"
              checked={formState.active}
              onChange={(e) => onUpdateField('active', e.target.checked)}
              className="w-4 h-4"
            />
            <Text as="span" className="text-xs text-text-primary">
              {PDV_TEXTS.FIELD_ACTIVE}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="border-t border-border pt-4 space-y-4">
          <LayoutContainer className="flex items-center justify-between gap-2">
            <Title level="h3" className="text-sm font-bold text-text-primary uppercase tracking-wide">
              {PDV_TEXTS.VARIANTS_TITLE}
            </Title>
            <Button
              type="button"
              variant="outline"
              onClick={onAddVariant}
              disabled={isSavingProduct}
              className="px-3 py-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              {PDV_TEXTS.BTN_ADD_VARIANT}
            </Button>
          </LayoutContainer>

          <LayoutContainer className="space-y-4">
            {formState.variants.map((variant, index) => (
              <LayoutContainer
                key={variant.id || `variant-${index}`}
                className="p-4 rounded-xl bg-background border border-border space-y-3"
              >
                <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FormField label={PDV_TEXTS.FIELD_SKU} required>
                    <Input
                      value={variant.sku}
                      onChange={(e) => onUpdateVariant(index, 'sku', e.target.value)}
                      disabled={isSavingProduct}
                    />
                  </FormField>

                  <FormField label={PDV_TEXTS.FIELD_EAN}>
                    <Input
                      value={variant.eanBarcode || ''}
                      onChange={(e) => onUpdateVariant(index, 'eanBarcode', e.target.value)}
                      disabled={isSavingProduct}
                    />
                  </FormField>

                  <FormField label={PDV_TEXTS.FIELD_SIZE} required>
                    <Input
                      value={variant.sizeLabel}
                      onChange={(e) => onUpdateVariant(index, 'sizeLabel', e.target.value)}
                      disabled={isSavingProduct}
                    />
                  </FormField>
                </LayoutContainer>

                <LayoutContainer className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <FormField label={PDV_TEXTS.FIELD_COLOR}>
                    <Input
                      value={variant.colorLabel || ''}
                      onChange={(e) => onUpdateVariant(index, 'colorLabel', e.target.value)}
                      disabled={isSavingProduct}
                    />
                  </FormField>

                  <FormField label={PDV_TEXTS.FIELD_COST} required>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={variant.costPrice}
                      onChange={(e) => onUpdateVariant(index, 'costPrice', Number(e.target.value))}
                      disabled={isSavingProduct}
                    />
                  </FormField>

                  <FormField label={PDV_TEXTS.FIELD_PRICE} required>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={variant.salePrice}
                      onChange={(e) => onUpdateVariant(index, 'salePrice', Number(e.target.value))}
                      disabled={isSavingProduct}
                    />
                  </FormField>

                  <FormField label={PDV_TEXTS.FIELD_MEMBER_PRICE}>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={variant.memberPrice ?? ''}
                      onChange={(e) =>
                        onUpdateVariant(
                          index,
                          'memberPrice',
                          e.target.value === '' ? null : Number(e.target.value),
                        )
                      }
                      disabled={isSavingProduct}
                    />
                  </FormField>

                  <FormField label={PDV_TEXTS.FIELD_MIN_STOCK}>
                    <Input
                      type="number"
                      min="0"
                      value={variant.minStock ?? 0}
                      onChange={(e) => onUpdateVariant(index, 'minStock', Number(e.target.value))}
                      disabled={isSavingProduct}
                    />
                  </FormField>
                </LayoutContainer>

                {formState.variants.length > 1 && (
                  <LayoutContainer className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onRemoveVariant(index)}
                      disabled={isSavingProduct}
                      className="text-xs text-[#ea580c] px-2 py-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {PDV_TEXTS.BTN_REMOVE_VARIANT}
                    </Button>
                  </LayoutContainer>
                )}
              </LayoutContainer>
            ))}
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSavingProduct}>
            {PDV_TEXTS.BTN_CANCEL}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSavingProduct || isUploadingImage}
          >
            {isSavingProduct ? PDV_TEXTS.BTN_SAVING : PDV_TEXTS.BTN_SAVE_PRODUCT}
          </Button>
        </LayoutContainer>
      </Form>
    </Drawer>
  );
};
