'use client';

import React from 'react';
import { Plus, Search, Pencil, SlidersHorizontal, Package } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Input,
  Spinner,
  SafeImage,
} from '@/shared/ui/components';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { usePdvProducts } from '../../hooks/usePdvProducts';
import { formatCurrencyBrl } from '../../utils/pdv.formatters';
import { PdvShell } from '../components/PdvShell';
import { ProductEditorDrawer } from '../components/ProductEditorDrawer';
import { StockAdjustModal } from '../components/StockAdjustModal';

export const PdvProductsFeature = () => {
  const {
    products,
    categories,
    search,
    setSearch,
    isLoading,
    isDrawerOpen,
    editingProductId,
    formState,
    isUploadingImage,
    isSavingProduct,
    fileInputRef,
    openCreateDrawer,
    openEditDrawer,
    closeDrawer,
    updateField,
    addVariantRow,
    removeVariantRow,
    updateVariantField,
    handleSelectImageClick,
    handleFileChange,
    handleSaveProduct,
    adjustTarget,
    adjustDelta,
    setAdjustDelta,
    adjustReason,
    setAdjustReason,
    isAdjusting,
    openAdjustModal,
    closeAdjustModal,
    handleConfirmAdjust,
  } = usePdvProducts();

  return (
    <PdvShell>
      <LayoutContainer className="space-y-6">
        <LayoutContainer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Title level="h1" className="text-2xl font-extrabold text-text-primary">
            {PDV_TEXTS.PRODUCTS_TITLE}
          </Title>
          <Button variant="primary" onClick={openCreateDrawer}>
            <Plus className="w-4 h-4" />
            {PDV_TEXTS.PRODUCTS_NEW_BTN}
          </Button>
        </LayoutContainer>

        <LayoutContainer className="relative flex items-center">
          <Search className="w-4 h-4 text-text-secondary absolute left-3.5 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={PDV_TEXTS.PRODUCTS_SEARCH_PLACEHOLDER}
            className="pl-10"
          />
        </LayoutContainer>

        {isLoading ? (
          <Spinner text={PDV_TEXTS.PRODUCTS_LOADING} />
        ) : products.length === 0 ? (
          <LayoutContainer className="bg-surface border border-border rounded-2xl p-10 text-center space-y-3">
            <Package className="w-10 h-10 text-primary mx-auto opacity-80" />
            <Text className="text-sm text-text-secondary">{PDV_TEXTS.PRODUCTS_EMPTY}</Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="space-y-4">
            {products.map((product) => (
              <LayoutContainer
                key={product.id}
                className="bg-surface border border-border rounded-2xl p-5 space-y-4"
              >
                <LayoutContainer className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <LayoutContainer className="flex items-center gap-4">
                    <SafeImage
                      src={product.coverImageUrl}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover border border-border shrink-0"
                    />
                    <LayoutContainer className="space-y-1">
                      <LayoutContainer className="flex flex-wrap items-center gap-2">
                        <Title level="h2" className="text-lg font-bold text-text-primary">
                          {product.name}
                        </Title>
                        <Badge variant={product.active ? 'success' : 'warning'}>
                          {product.active ? PDV_TEXTS.PRODUCTS_ACTIVE : PDV_TEXTS.PRODUCTS_INACTIVE}
                        </Badge>
                        {product.featured && (
                          <Badge variant="primary">{PDV_TEXTS.PRODUCTS_FEATURED}</Badge>
                        )}
                      </LayoutContainer>
                      <Text className="text-xs text-text-secondary">
                        {product.categoryName || PDV_TEXTS.PRODUCTS_CATEGORY_NONE} · {product.brand}
                      </Text>
                    </LayoutContainer>
                  </LayoutContainer>

                  <Button
                    variant="outline"
                    onClick={() => openEditDrawer(product)}
                    className="text-xs self-start md:self-center"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    {PDV_TEXTS.PRODUCTS_EDIT_BTN}
                  </Button>
                </LayoutContainer>

                <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {product.variants.map((variant) => (
                    <LayoutContainer
                      key={variant.id || variant.sku}
                      className="p-3.5 rounded-xl bg-background border border-border flex flex-col justify-between gap-3"
                    >
                      <LayoutContainer className="space-y-1.5">
                        <LayoutContainer className="flex items-center justify-between gap-2">
                          <Text as="span" className="text-sm font-bold text-text-primary">
                            {variant.sizeLabel} · {variant.sku}
                          </Text>
                          {variant.lowStock && (
                            <Badge variant="danger">{PDV_TEXTS.PRODUCTS_LOW_STOCK_BADGE}</Badge>
                          )}
                        </LayoutContainer>

                        <Text className="text-xs text-text-secondary">
                          {PDV_TEXTS.FIELD_PRICE}: {formatCurrencyBrl(variant.salePrice)}
                          {variant.memberPrice !== null && variant.memberPrice !== undefined
                            ? ` · ${PDV_TEXTS.FIELD_MEMBER_PRICE}: ${formatCurrencyBrl(variant.memberPrice)}`
                            : ''}
                        </Text>

                        <Text className="text-xs text-text-primary font-semibold">
                          {PDV_TEXTS.PRODUCTS_STOCK_AVAILABLE}: {variant.availableStock ?? 0} ·{' '}
                          {PDV_TEXTS.PRODUCTS_STOCK_PHYSICAL}: {variant.physicalStock ?? 0} ·{' '}
                          {PDV_TEXTS.PRODUCTS_STOCK_RESERVED}: {variant.reservedStock ?? 0}
                        </Text>
                      </LayoutContainer>

                      {variant.id && (
                        <Button
                          variant="outline"
                          onClick={() => openAdjustModal(variant, product.name)}
                          className="w-full py-1.5 text-xs"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          {PDV_TEXTS.PRODUCTS_ADJUST_BTN}
                        </Button>
                      )}
                    </LayoutContainer>
                  ))}
                </LayoutContainer>
              </LayoutContainer>
            ))}
          </LayoutContainer>
        )}
      </LayoutContainer>

      <ProductEditorDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        editingProductId={editingProductId}
        categories={categories}
        formState={formState}
        isUploadingImage={isUploadingImage}
        isSavingProduct={isSavingProduct}
        fileInputRef={fileInputRef}
        onUpdateField={updateField}
        onAddVariant={addVariantRow}
        onRemoveVariant={removeVariantRow}
        onUpdateVariant={updateVariantField}
        onSelectImageClick={handleSelectImageClick}
        onFileChange={handleFileChange}
        onSubmit={handleSaveProduct}
      />

      <StockAdjustModal
        variant={adjustTarget}
        delta={adjustDelta}
        onChangeDelta={setAdjustDelta}
        reason={adjustReason}
        onChangeReason={setAdjustReason}
        isSubmitting={isAdjusting}
        onClose={closeAdjustModal}
        onSubmit={handleConfirmAdjust}
      />
    </PdvShell>
  );
};
