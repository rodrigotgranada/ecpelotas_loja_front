'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  pdvService,
  CategoryItem,
  ProductItem,
  ProductVariantItem,
} from '../services/pdv.service';
import { PDV_TEXTS } from '../constants/pdv.constants';
import { extractApiError } from '../utils/pdv.formatters';

export interface ProductEditorFormState {
  name: string;
  categoryId: string;
  brand: string;
  description: string;
  coverImageUrl: string;
  featured: boolean;
  active: boolean;
  variants: ProductVariantItem[];
}

const createEmptyVariant = (): ProductVariantItem => ({
  sku: '',
  eanBarcode: '',
  sizeLabel: 'U',
  colorLabel: '',
  costPrice: 0,
  salePrice: 0,
  memberPrice: null,
  minStock: 2,
  active: true,
});

const createInitialFormState = (): ProductEditorFormState => ({
  name: '',
  categoryId: '',
  brand: 'Alcateia Oficial',
  description: '',
  coverImageUrl: '',
  featured: false,
  active: true,
  variants: [createEmptyVariant()],
});

export const usePdvProducts = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formState, setFormState] = useState<ProductEditorFormState>(createInitialFormState);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  const [adjustTarget, setAdjustTarget] = useState<ProductVariantItem | null>(null);
  const [adjustDelta, setAdjustDelta] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [isAdjusting, setIsAdjusting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inFlightSaveRef = useRef(false);
  const inFlightAdjustRef = useRef(false);

  const fetchData = useCallback(async (query?: string) => {
    setIsLoading(true);
    try {
      const [catList, prodRes] = await Promise.all([
        pdvService.listCategories(),
        pdvService.listProducts(query, 1, 50),
      ]);
      setCategories(catList);
      setProducts(prodRes.data);
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.PRODUCTS_EMPTY));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(search.trim() || undefined);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, fetchData]);

  const openCreateDrawer = () => {
    setEditingProductId(null);
    setFormState(createInitialFormState());
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (product: ProductItem) => {
    setEditingProductId(product.id);
    setFormState({
      name: product.name,
      categoryId: product.categoryId || '',
      brand: product.brand || '',
      description: product.description || '',
      coverImageUrl: product.coverImageUrl || '',
      featured: product.featured,
      active: product.active,
      variants:
        product.variants.length > 0
          ? product.variants.map((v) => ({
              id: v.id,
              sku: v.sku,
              eanBarcode: v.eanBarcode || '',
              sizeLabel: v.sizeLabel,
              colorLabel: v.colorLabel || '',
              costPrice: Number(v.costPrice ?? 0),
              salePrice: Number(v.salePrice ?? 0),
              memberPrice: v.memberPrice !== null && v.memberPrice !== undefined ? Number(v.memberPrice) : null,
              minStock: Number(v.minStock ?? 0),
              active: v.active ?? true,
            }))
          : [createEmptyVariant()],
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    if (isSavingProduct || isUploadingImage) return;
    setIsDrawerOpen(false);
  };

  const updateField = <K extends keyof ProductEditorFormState>(
    field: K,
    value: ProductEditorFormState[K],
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const addVariantRow = () => {
    setFormState((prev) => ({
      ...prev,
      variants: [...prev.variants, createEmptyVariant()],
    }));
  };

  const removeVariantRow = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      variants:
        prev.variants.length > 1
          ? prev.variants.filter((_, idx) => idx !== index)
          : prev.variants,
    }));
  };

  const updateVariantField = <K extends keyof ProductVariantItem>(
    index: number,
    field: K,
    value: ProductVariantItem[K],
  ) => {
    setFormState((prev) => ({
      ...prev,
      variants: prev.variants.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const handleSelectImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const uploadedUrl = await pdvService.uploadProductImage(file);
      updateField('coverImageUrl', uploadedUrl);
      toast.success(PDV_TEXTS.PRODUCTS_UPLOAD_SUCCESS);
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.PRODUCTS_UPLOAD_ERROR));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlightSaveRef.current || isUploadingImage) return;

    const trimmedName = formState.name.trim();
    if (!trimmedName) {
      toast.error(PDV_TEXTS.VALIDATION_PRODUCT_NAME);
      return;
    }

    const validVariants = formState.variants.filter(
      (v) => v.sku.trim() && v.sizeLabel.trim() && Number(v.salePrice) > 0,
    );
    if (validVariants.length === 0) {
      toast.error(PDV_TEXTS.VALIDATION_VARIANT_REQUIRED);
      return;
    }

    inFlightSaveRef.current = true;
    setIsSavingProduct(true);

    try {
      const payload = {
        name: trimmedName,
        categoryId: formState.categoryId || undefined,
        brand: formState.brand.trim() || undefined,
        description: formState.description.trim() || undefined,
        coverImageUrl: formState.coverImageUrl.trim() || undefined,
        featured: formState.featured,
        active: formState.active,
        variants: formState.variants.map((v) => ({
          id: v.id,
          sku: v.sku.trim(),
          eanBarcode: v.eanBarcode?.trim() || undefined,
          sizeLabel: v.sizeLabel.trim(),
          colorLabel: v.colorLabel?.trim() || undefined,
          costPrice: Number(v.costPrice || 0),
          salePrice: Number(v.salePrice),
          memberPrice:
            v.memberPrice !== null && v.memberPrice !== undefined && String(v.memberPrice) !== ''
              ? Number(v.memberPrice)
              : null,
          minStock: Number(v.minStock ?? 0),
          active: v.active ?? true,
        })),
      };

      if (editingProductId) {
        await pdvService.updateProduct(editingProductId, payload);
      } else {
        await pdvService.createProduct(payload);
      }

      toast.success(PDV_TEXTS.PRODUCTS_SAVE_SUCCESS);
      setIsDrawerOpen(false);
      await fetchData(search.trim() || undefined);
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.PRODUCTS_SAVE_ERROR));
    } finally {
      inFlightSaveRef.current = false;
      setIsSavingProduct(false);
    }
  };

  const openAdjustModal = (variant: ProductVariantItem, productName: string) => {
    setAdjustTarget({ ...variant, productName });
    setAdjustDelta('');
    setAdjustReason('');
  };

  const closeAdjustModal = () => {
    if (isAdjusting) return;
    setAdjustTarget(null);
  };

  const handleConfirmAdjust = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!adjustTarget?.id || inFlightAdjustRef.current) return;

    const delta = Number.parseInt(adjustDelta, 10);
    if (!Number.isFinite(delta) || delta === 0) {
      toast.error(PDV_TEXTS.ADJUST_DELTA_INVALID);
      return;
    }

    const reason = adjustReason.trim();
    if (!reason) {
      toast.error(PDV_TEXTS.ADJUST_REASON_REQUIRED);
      return;
    }

    inFlightAdjustRef.current = true;
    setIsAdjusting(true);

    try {
      await pdvService.adjustStock(adjustTarget.id, delta, reason);
      toast.success(PDV_TEXTS.ADJUST_SUCCESS);
      setAdjustTarget(null);
      await fetchData(search.trim() || undefined);
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.ADJUST_ERROR));
    } finally {
      inFlightAdjustRef.current = false;
      setIsAdjusting(false);
    }
  };

  return {
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
  };
};
