'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
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
import { STOREFRONT_TEXTS } from '../../constants/storefront.constants';
import { useProductDetail } from '../../hooks/useProductDetail';
import { formatCurrencyBrl } from '../../utils/storefront.formatters';
import { StorefrontHeader } from '../components/StorefrontHeader';

export const ProductDetailFeature = ({ slug }: { slug: string }) => {
  const {
    product,
    selectedVariant,
    quantity,
    setQuantity,
    isLoading,
    selectVariant,
    handleAddToCart,
  } = useProductDetail(slug);

  return (
    <LayoutContainer className="min-h-screen flex flex-col">
      <StorefrontHeader />

      <LayoutContainer as="main" className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-6">
        <Link href="/">
          <Button variant="ghost" className="px-2 py-1 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            {STOREFRONT_TEXTS.DETAIL_BACK}
          </Button>
        </Link>

        {isLoading ? (
          <Spinner text={STOREFRONT_TEXTS.DETAIL_LOADING} />
        ) : !product ? (
          <LayoutContainer className="bg-surface border border-border rounded-2xl p-10 text-center">
            <Text className="text-sm text-text-secondary">{STOREFRONT_TEXTS.DETAIL_NOT_FOUND}</Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="bg-surface border border-border rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <LayoutContainer className="bg-background rounded-2xl overflow-hidden border border-border min-h-[320px]">
              <SafeImage
                src={product.coverImageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </LayoutContainer>

            <LayoutContainer className="flex flex-col justify-between gap-6">
              <LayoutContainer className="space-y-4">
                <LayoutContainer className="flex flex-wrap items-center gap-2">
                  {product.categoryName && <Badge variant="default">{product.categoryName}</Badge>}
                  {product.brand && <Badge variant="primary">{product.brand}</Badge>}
                </LayoutContainer>

                <Title level="h1" className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                  {product.name}
                </Title>

                {product.description && (
                  <Text className="text-sm text-text-secondary leading-relaxed">
                    {product.description}
                  </Text>
                )}

                {selectedVariant && (
                  <LayoutContainer className="p-4 rounded-xl bg-background border border-border space-y-1">
                    <Text className="text-2xl font-extrabold text-primary">
                      {formatCurrencyBrl(selectedVariant.salePrice)}
                    </Text>
                    {selectedVariant.memberPrice != null && (
                      <Text className="text-sm font-semibold text-success">
                        {STOREFRONT_TEXTS.MEMBER_PRICE_PREFIX}{' '}
                        {formatCurrencyBrl(selectedVariant.memberPrice)}
                      </Text>
                    )}
                    <Text className="text-xs text-text-secondary">
                      {STOREFRONT_TEXTS.DETAIL_SKU_LABEL} {selectedVariant.sku} ·{' '}
                      {selectedVariant.availableStock > 0
                        ? `${STOREFRONT_TEXTS.DETAIL_AVAIL_PREFIX} ${selectedVariant.availableStock}`
                        : STOREFRONT_TEXTS.OUT_OF_STOCK}
                    </Text>
                  </LayoutContainer>
                )}

                <LayoutContainer className="space-y-2">
                  <Text className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    {STOREFRONT_TEXTS.DETAIL_SELECT_SIZE}
                  </Text>
                  <LayoutContainer className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id;
                      const outOfStock = variant.availableStock <= 0;
                      return (
                        <Button
                          key={variant.id}
                          variant={isSelected ? 'primary' : 'outline'}
                          onClick={() => selectVariant(variant.id)}
                          className="px-3.5 py-2 text-xs"
                        >
                          {variant.sizeLabel}
                          {outOfStock ? ` (${STOREFRONT_TEXTS.OUT_OF_STOCK})` : ''}
                        </Button>
                      );
                    })}
                  </LayoutContainer>
                </LayoutContainer>
              </LayoutContainer>

              <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-border">
                {selectedVariant && selectedVariant.availableStock > 0 ? (
                  <>
                    <Input
                      type="number"
                      min={1}
                      max={selectedVariant.availableStock}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(
                            1,
                            Math.min(Number(e.target.value) || 1, selectedVariant.availableStock),
                          ),
                        )
                      }
                      className="sm:w-24 text-center"
                    />
                    <Button variant="primary" onClick={handleAddToCart} className="flex-1">
                      <ShoppingCart className="w-4 h-4" />
                      {STOREFRONT_TEXTS.DETAIL_ADD_CART}
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" disabled className="w-full opacity-60">
                    {STOREFRONT_TEXTS.DETAIL_OUT_OF_STOCK_BTN}
                  </Button>
                )}
              </LayoutContainer>
            </LayoutContainer>
          </LayoutContainer>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
