'use client';

import React from 'react';
import { ShoppingBag, Search } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Input,
  Select,
  SelectOption,
  Spinner,
} from '@/shared/ui/components';
import { STOREFRONT_TEXTS } from '../../constants/storefront.constants';
import { useStorefrontHome } from '../../hooks/useStorefrontHome';
import { StorefrontHeader } from '../components/StorefrontHeader';
import { ProductCard } from '../components/ProductCard';

export const StorefrontHomeFeature = () => {
  const {
    categories,
    products,
    selectedCategory,
    setSelectedCategory,
    search,
    setSearch,
    isLoading,
  } = useStorefrontHome();

  return (
    <LayoutContainer className="min-h-screen flex flex-col">
      <StorefrontHeader />

      <LayoutContainer as="main" className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-10 space-y-8">
        <LayoutContainer className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
          <Badge variant="primary">{STOREFRONT_TEXTS.BADGE}</Badge>
          <Title level="h1" className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            {STOREFRONT_TEXTS.TITLE}
          </Title>
          <Text className="text-sm text-text-secondary leading-relaxed max-w-3xl">
            {STOREFRONT_TEXTS.SUBTITLE}
          </Text>
        </LayoutContainer>

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

        {isLoading ? (
          <Spinner text={STOREFRONT_TEXTS.LOADING} />
        ) : products.length === 0 ? (
          <LayoutContainer className="bg-surface border border-border rounded-2xl p-10 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-primary mx-auto opacity-80" />
            <Text className="text-sm text-text-secondary">{STOREFRONT_TEXTS.EMPTY_STATE}</Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </LayoutContainer>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
