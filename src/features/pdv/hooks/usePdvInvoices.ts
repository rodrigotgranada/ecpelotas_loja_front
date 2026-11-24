'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  pdvService,
  CategoryItem,
  ProductVariantItem,
  StockDocument,
  StockDocumentItem,
} from '../services/pdv.service';
import { PDV_TEXTS } from '../constants/pdv.constants';
import { extractApiError } from '../utils/pdv.formatters';

export interface CreateFromInvoiceFormState {
  productName: string;
  categoryId: string;
  sku: string;
  eanBarcode: string;
  sizeLabel: string;
  colorLabel: string;
  salePrice: string;
  memberPrice: string;
}

export const usePdvInvoices = () => {
  const [invoices, setInvoices] = useState<StockDocument[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<StockDocument | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImportingXml, setIsImportingXml] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const [skuSearchByItem, setSkuSearchByItem] = useState<Record<string, string>>({});
  const [skuMatchesByItem, setSkuMatchesByItem] = useState<Record<string, ProductVariantItem[]>>({});
  const [linkingItemId, setLinkingItemId] = useState<string | null>(null);

  const [createModalItem, setCreateModalItem] = useState<StockDocumentItem | null>(null);
  const [createForm, setCreateForm] = useState<CreateFromInvoiceFormState>({
    productName: '',
    categoryId: '',
    sku: '',
    eanBarcode: '',
    sizeLabel: 'U',
    colorLabel: '',
    salePrice: '',
    memberPrice: '',
  });
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  const xmlInputRef = useRef<HTMLInputElement | null>(null);
  const inFlightConfirmRef = useRef(false);
  const inFlightCreateRef = useRef(false);

  const fetchInvoices = useCallback(async (preferredId?: string) => {
    setIsLoading(true);
    try {
      const [docsRes, catsRes] = await Promise.all([
        pdvService.listInvoices(1, 30),
        pdvService.listCategories(),
      ]);
      setCategories(catsRes);
      setInvoices(docsRes.data);

      setSelectedInvoice((prev) => {
        const targetId = preferredId ?? prev?.id;
        if (targetId) {
          const found = docsRes.data.find((d) => d.id === targetId);
          if (found) return found;
        }
        return docsRes.data[0] ?? null;
      });
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.INVOICES_EMPTY));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchInvoices();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchInvoices]);

  const handleImportXmlClick = () => {
    xmlInputRef.current?.click();
  };

  const handleXmlFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setIsImportingXml(true);
    try {
      const created = await pdvService.importNfeXml(file);
      toast.success(PDV_TEXTS.INVOICES_IMPORT_SUCCESS);
      await fetchInvoices(created.id);
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.INVOICES_IMPORT_ERROR));
    } finally {
      setIsImportingXml(false);
    }
  };

  const handleSelectInvoice = async (doc: StockDocument) => {
    try {
      const fresh = await pdvService.getInvoice(doc.id);
      setSelectedInvoice(fresh);
    } catch {
      setSelectedInvoice(doc);
    }
  };

  const updateItemSkuSearch = (itemId: string, value: string) => {
    setSkuSearchByItem((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleSearchVariantForItem = async (itemId: string) => {
    const query = (skuSearchByItem[itemId] || '').trim();
    if (!query) return;
    try {
      const matches = await pdvService.searchVariants(query);
      setSkuMatchesByItem((prev) => ({ ...prev, [itemId]: matches }));
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.INVOICES_LINK_ERROR));
    }
  };

  const handleLinkVariant = async (docId: string, itemId: string, variantId: string) => {
    setLinkingItemId(itemId);
    try {
      const updated = await pdvService.linkInvoiceItem(docId, itemId, variantId);
      setSelectedInvoice(updated);
      setInvoices((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      toast.success(PDV_TEXTS.INVOICES_LINK_SUCCESS);
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.INVOICES_LINK_ERROR));
    } finally {
      setLinkingItemId(null);
    }
  };

  const openCreateFromItemModal = (item: StockDocumentItem) => {
    const suggestedPrice = item.unitCost > 0 ? (item.unitCost * 2).toFixed(2) : '';
    setCreateModalItem(item);
    setCreateForm({
      productName: item.supplierProductName,
      categoryId: categories[0]?.id || '',
      sku: item.supplierProductCode || `ALC-${item.lineNumber}`,
      eanBarcode: item.eanBarcode || '',
      sizeLabel: 'U',
      colorLabel: '',
      salePrice: suggestedPrice,
      memberPrice: '',
    });
  };

  const closeCreateFromItemModal = () => {
    if (isCreatingProduct) return;
    setCreateModalItem(null);
  };

  const updateCreateFormField = <K extends keyof CreateFromInvoiceFormState>(
    field: K,
    value: CreateFromInvoiceFormState[K],
  ) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateProductFromItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedInvoice || !createModalItem || inFlightCreateRef.current) return;

    const salePrice = Number(createForm.salePrice);
    if (!createForm.productName.trim() || !createForm.sku.trim() || !createForm.sizeLabel.trim() || !Number.isFinite(salePrice) || salePrice <= 0) {
      toast.error(PDV_TEXTS.VALIDATION_VARIANT_REQUIRED);
      return;
    }

    inFlightCreateRef.current = true;
    setIsCreatingProduct(true);

    try {
      const memberPriceNum = createForm.memberPrice.trim() ? Number(createForm.memberPrice) : undefined;
      const updated = await pdvService.createProductFromInvoiceItem(
        selectedInvoice.id,
        createModalItem.id,
        {
          productName: createForm.productName.trim(),
          categoryId: createForm.categoryId || undefined,
          sku: createForm.sku.trim(),
          eanBarcode: createForm.eanBarcode.trim() || undefined,
          sizeLabel: createForm.sizeLabel.trim(),
          colorLabel: createForm.colorLabel.trim() || undefined,
          salePrice,
          memberPrice: memberPriceNum,
        },
      );
      setSelectedInvoice(updated);
      setInvoices((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      setCreateModalItem(null);
      toast.success(PDV_TEXTS.CREATE_FROM_INVOICE_SUCCESS);
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.CREATE_FROM_INVOICE_ERROR));
    } finally {
      inFlightCreateRef.current = false;
      setIsCreatingProduct(false);
    }
  };

  const handleConfirmInvoice = async () => {
    if (!selectedInvoice || inFlightConfirmRef.current) return;
    inFlightConfirmRef.current = true;
    setIsConfirming(true);

    try {
      const updated = await pdvService.confirmInvoice(selectedInvoice.id);
      setSelectedInvoice(updated);
      setInvoices((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      toast.success(PDV_TEXTS.INVOICES_CONFIRMED_SUCCESS);
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.INVOICES_CONFIRM_ERROR));
    } finally {
      inFlightConfirmRef.current = false;
      setIsConfirming(false);
    }
  };

  return {
    invoices,
    selectedInvoice,
    categories,
    isLoading,
    isImportingXml,
    isConfirming,
    xmlInputRef,
    skuSearchByItem,
    skuMatchesByItem,
    linkingItemId,
    createModalItem,
    createForm,
    isCreatingProduct,
    handleImportXmlClick,
    handleXmlFileChange,
    handleSelectInvoice,
    updateItemSkuSearch,
    handleSearchVariantForItem,
    handleLinkVariant,
    openCreateFromItemModal,
    closeCreateFromItemModal,
    updateCreateFormField,
    handleCreateProductFromItem,
    handleConfirmInvoice,
  };
};
