'use client';

import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/useCartStore';
import {
  storefrontService,
  PublicProduct,
  PublicVariant,
} from '../services/storefront.service';
import { STOREFRONT_TEXTS } from '../constants/storefront.constants';

export const useProductDetail = (slug: string) => {
  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await storefrontService.getProductBySlug(slug);
        setProduct(data);
        const firstAvailable = data.variants.find((v) => v.availableStock > 0);
        setSelectedVariantId(firstAvailable?.id || data.variants[0]?.id || '');
      } catch {
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [slug]);

  const selectedVariant: PublicVariant | null = useMemo(() => {
    if (!product) return null;
    return product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0] ?? null;
  }, [product, selectedVariantId]);

  const selectVariant = (variantId: string) => {
    setSelectedVariantId(variantId);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant || selectedVariant.availableStock <= 0) {
      return;
    }
    addItem(
      {
        variantId: selectedVariant.id,
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        sku: selectedVariant.sku,
        sizeLabel: selectedVariant.sizeLabel,
        colorLabel: selectedVariant.colorLabel,
        coverImageUrl: product.coverImageUrl,
        salePrice: Number(selectedVariant.salePrice),
        memberPrice:
          selectedVariant.memberPrice !== null && selectedVariant.memberPrice !== undefined
            ? Number(selectedVariant.memberPrice)
            : null,
        availableStock: selectedVariant.availableStock,
      },
      quantity,
    );
    toast.success(STOREFRONT_TEXTS.DETAIL_ADDED_SUCCESS);
  };

  return {
    product,
    selectedVariant,
    quantity,
    setQuantity,
    isLoading,
    selectVariant,
    handleAddToCart,
  };
};
