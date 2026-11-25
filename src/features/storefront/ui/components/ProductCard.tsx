'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutContainer, Title, Text, Badge, SafeImage } from '@/shared/ui/components';
import { PublicProduct } from '../../services/storefront.service';
import { STOREFRONT_TEXTS } from '../../constants/storefront.constants';
import { formatCurrencyBrl } from '../../utils/storefront.formatters';

export interface ProductCardProps {
  product: PublicProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const firstVariant = product.variants?.[0];
  const hasStock = product.totalAvailableStock > 0;

  return (
    <Link href={`/produto/${product.slug}`} className="group block">
      <LayoutContainer className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col h-full hover:border-primary/60 transition-colors shadow-md">
        <LayoutContainer className="h-56 w-full bg-background/60 overflow-hidden">
          <SafeImage
            src={product.coverImageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </LayoutContainer>

        <LayoutContainer className="p-5 flex-1 flex flex-col justify-between gap-4">
          <LayoutContainer className="space-y-2">
            <LayoutContainer className="flex items-center justify-between gap-2">
              {product.categoryName && <Badge variant="default">{product.categoryName}</Badge>}
              <Badge variant={hasStock ? 'success' : 'warning'}>
                {hasStock
                  ? `${product.totalAvailableStock} ${STOREFRONT_TEXTS.STOCK_AVAILABLE_SUFFIX}`
                  : STOREFRONT_TEXTS.OUT_OF_STOCK}
              </Badge>
            </LayoutContainer>

            <Title level="h2" className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
              {product.name}
            </Title>

            {product.description && (
              <Text className="text-xs text-text-secondary line-clamp-2">{product.description}</Text>
            )}
          </LayoutContainer>

          {firstVariant && (
            <LayoutContainer className="pt-3 border-t border-border flex items-end justify-between">
              <LayoutContainer className="space-y-0.5">
                <Text className="text-lg font-extrabold text-primary">
                  {formatCurrencyBrl(firstVariant.salePrice)}
                </Text>
                {firstVariant.memberPrice != null && (
                  <Text className="text-xs text-text-secondary">
                    {STOREFRONT_TEXTS.MEMBER_PRICE_PREFIX} {formatCurrencyBrl(firstVariant.memberPrice)}
                  </Text>
                )}
              </LayoutContainer>
              <Text as="span" className="text-xs text-text-secondary">
                {product.variants.map((v) => v.sizeLabel).join(' · ')}
              </Text>
            </LayoutContainer>
          )}
        </LayoutContainer>
      </LayoutContainer>
    </Link>
  );
};
