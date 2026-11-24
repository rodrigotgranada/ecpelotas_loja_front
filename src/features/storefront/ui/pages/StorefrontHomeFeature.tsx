'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ExternalLink, Search } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Input,
  Select,
  SelectOption,
  Spinner,
  SafeImage,
} from '@/shared/ui/components';
import { STOREFRONT_TEXTS } from '../../constants/storefront.constants';
import { useStorefrontHome } from '../../hooks/useStorefrontHome';

export const StorefrontHomeFeature = () => {
  const {
    categories,
    products,
    selectedCategory,
    setSelectedCategory,
    search,
    setSearch,
    isLoading,
    portalUrl,
  } = useStorefrontHome();

  return (
    <LayoutContainer as="main" className="min-h-screen px-4 py-8 sm:py-12">
      <LayoutContainer className="max-w-6xl mx-auto space-y-8">
        {/* Header / Hero */}
        <LayoutContainer className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <LayoutContainer className="space-y-3 max-w-2xl">
            <Badge variant="primary">{STOREFRONT_TEXTS.BADGE}</Badge>
            <Title level="h1" className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              {STOREFRONT_TEXTS.TITLE}
            </Title>
            <Text className="text-sm text-text-secondary leading-relaxed">
              {STOREFRONT_TEXTS.SUBTITLE}
            </Text>
          </LayoutContainer>

          <LayoutContainer className="flex flex-wrap gap-3 shrink-0">
            <Link href="/pdv">
              <Button variant="primary">{STOREFRONT_TEXTS.BUTTON_OPEN_PDV}</Button>
            </Link>
            <Link href={portalUrl}>
              <Button variant="outline">
                {STOREFRONT_TEXTS.BUTTON_BACK_PORTAL}
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </LayoutContainer>
        </LayoutContainer>

        {/* Filters */}
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <LayoutContainer className="sm:col-span-2 relative flex items-center">
            <Search className="w-4 h-4 text-text-secondary absolute left-3.5 pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={STOREFRONT_TEXTS.SEARCH_PLACEHOLDER}
              className="pl-10"
            />
          </LayoutContainer>

          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <SelectOption value="">{STOREFRONT_TEXTS.ALL_CATEGORIES}</SelectOption>
            {categories.map((cat) => (
              <SelectOption key={cat.id} value={cat.id}>
                {cat.name}
              </SelectOption>
            ))}
          </Select>
        </LayoutContainer>

        {/* Product Grid */}
        {isLoading ? (
          <Spinner text={STOREFRONT_TEXTS.LOADING} />
        ) : products.length === 0 ? (
          <LayoutContainer className="bg-surface border border-border rounded-2xl p-10 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-primary mx-auto opacity-80" />
            <Text className="text-sm text-text-secondary">{STOREFRONT_TEXTS.EMPTY_STATE}</Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const firstVariant = product.variants?.[0];
              return (
                <LayoutContainer
                  key={product.id}
                  className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col hover:border-primary/50 transition-colors shadow-md"
                >
                  <LayoutContainer className="h-52 w-full bg-background/60 overflow-hidden">
                    <SafeImage
                      src={product.coverImageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </LayoutContainer>

                  <LayoutContainer className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <LayoutContainer className="space-y-2">
                      <LayoutContainer className="flex items-center justify-between gap-2">
                        {product.categoryName && <Badge variant="default">{product.categoryName}</Badge>}
                        <Badge variant={product.totalAvailableStock > 0 ? 'success' : 'warning'}>
                          {product.totalAvailableStock > 0
                            ? `${product.totalAvailableStock} ${STOREFRONT_TEXTS.STOCK_AVAILABLE_SUFFIX}`
                            : STOREFRONT_TEXTS.OUT_OF_STOCK}
                        </Badge>
                      </LayoutContainer>
                      <Title level="h2" className="text-lg font-bold text-text-primary">
                        {product.name}
                      </Title>
                      {product.description && (
                        <Text className="text-xs text-text-secondary line-clamp-2">
                          {product.description}
                        </Text>
                      )}
                    </LayoutContainer>

                    {firstVariant && (
                      <LayoutContainer className="pt-3 border-t border-border flex items-end justify-between">
                        <LayoutContainer className="space-y-0.5">
                          <Text className="text-lg font-extrabold text-primary">
                            {STOREFRONT_TEXTS.CURRENCY_PREFIX} {Number(firstVariant.salePrice).toFixed(2)}
                          </Text>
                          {firstVariant.memberPrice != null && (
                            <Text className="text-xs text-text-secondary">
                              {STOREFRONT_TEXTS.MEMBER_PRICE_PREFIX} {STOREFRONT_TEXTS.CURRENCY_PREFIX}{' '}
                              {Number(firstVariant.memberPrice).toFixed(2)}
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
              );
            })}
          </LayoutContainer>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
