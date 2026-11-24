'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  storefrontService,
  PublicCategory,
  PublicProduct,
} from '../services/storefront.service';

export const useStorefrontHome = () => {
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:7999';

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        storefrontService.getCategories(),
        storefrontService.getProducts(selectedCategory, search),
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData();
    }, 150);
    return () => clearTimeout(timer);
  }, [loadData]);

  return {
    categories,
    products,
    selectedCategory,
    setSelectedCategory,
    search,
    setSearch,
    isLoading,
    portalUrl,
  };
};
