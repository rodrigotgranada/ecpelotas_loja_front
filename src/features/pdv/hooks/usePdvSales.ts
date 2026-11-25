'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { pdvService, AdminOrderDto, ProductVariantItem } from '../services/pdv.service';
import { PDV_TEXTS } from '../constants/pdv.constants';
import { extractApiError } from '../utils/pdv.formatters';
import { useOrderRealtime } from './useOrderRealtime';
import { EditableOrderLine } from '../ui/components/OrderEditorModal';
import { PaymentLineInput } from '../ui/components/PaymentLinesBuilder';

export const usePdvSales = () => {
  const [orders, setOrders] = useState<AdminOrderDto[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDto | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING_WHATSAPP');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);

  const [editingOrder, setEditingOrder] = useState<AdminOrderDto | null>(null);
  const [editLines, setEditLines] = useState<EditableOrderLine[]>([]);
  const [editDiscount, setEditDiscount] = useState('0');
  const [editNotes, setEditNotes] = useState('');
  const [variantSearchQuery, setVariantSearchQuery] = useState('');
  const [variantResults, setVariantResults] = useState<ProductVariantItem[]>([]);

  const [checkoutOrder, setCheckoutOrder] = useState<AdminOrderDto | null>(null);
  const [payments, setPayments] = useState<PaymentLineInput[]>([{ paymentMethod: 'PIX', amount: '' }]);
  const [checkoutNotes, setCheckoutNotes] = useState('');
  const [receiptOrder, setReceiptOrder] = useState<AdminOrderDto | null>(null);

  const inFlightRef = useRef(false);
  const selectedCodeRef = useRef<string | null>(null);

  useEffect(() => {
    selectedCodeRef.current = selectedOrder?.orderCode ?? null;
  }, [selectedOrder]);

  const fetchOrders = useCallback(
    async (preferredCode?: string) => {
      setIsLoading(true);
      try {
        const res = await pdvService.listAdminOrders(
          statusFilter || undefined,
          search.trim() || undefined,
          1,
          40,
        );
        setOrders(res.data);

        const targetCode = preferredCode ?? selectedCodeRef.current;
        if (targetCode) {
          const fresh = await pdvService.getAdminOrder(targetCode).catch(() => null);
          if (fresh) {
            setSelectedOrder(fresh);
            return;
          }
        }
        if (res.data[0]) {
          const firstDetail = await pdvService.getAdminOrder(res.data[0].orderCode).catch(() => res.data[0]);
          setSelectedOrder(firstDetail);
        } else {
          setSelectedOrder(null);
        }
      } catch (error) {
        toast.error(extractApiError(error, PDV_TEXTS.SALES_EMPTY));
      } finally {
        setIsLoading(false);
      }
    },
    [statusFilter, search],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchOrders();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  useOrderRealtime(() => {
    void fetchOrders();
  });

  const handleSelectOrder = async (order: AdminOrderDto) => {
    try {
      const detail = await pdvService.getAdminOrder(order.orderCode);
      setSelectedOrder(detail);
    } catch {
      setSelectedOrder(order);
    }
  };

  const handleStartNegotiating = async () => {
    if (!selectedOrder || inFlightRef.current) return;
    inFlightRef.current = true;
    setIsBusy(true);
    try {
      const updated = await pdvService.startNegotiating(selectedOrder.orderCode);
      setSelectedOrder(updated);
      toast.success(PDV_TEXTS.SALES_ASSUMED_OK);
      await fetchOrders(updated.orderCode);
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.SALES_ACTION_ERROR));
    } finally {
      inFlightRef.current = false;
      setIsBusy(false);
    }
  };

  const openEditor = () => {
    if (!selectedOrder) return;
    setEditingOrder(selectedOrder);
    setEditLines(
      selectedOrder.items.map((item) => ({
        variantId: item.variantId,
        productName: item.productName,
        sku: item.sku,
        sizeLabel: item.sizeLabel,
        unitPrice: Number(item.appliedPrice),
        quantity: item.quantity,
      })),
    );
    setEditDiscount('0');
    setEditNotes(selectedOrder.notes || '');
    setVariantSearchQuery('');
    setVariantResults([]);
  };

  const closeEditor = () => {
    if (isBusy) return;
    setEditingOrder(null);
  };

  const handleSearchVariantsForEdit = async () => {
    if (!variantSearchQuery.trim()) return;
    try {
      const results = await pdvService.searchVariants(variantSearchQuery.trim());
      setVariantResults(results);
    } catch {
      setVariantResults([]);
    }
  };

  const handleAddVariantToEdit = (variant: ProductVariantItem) => {
    if (!variant.id) return;
    setEditLines((prev) => {
      const existing = prev.find((l) => l.variantId === variant.id);
      if (existing) {
        return prev.map((l) =>
          l.variantId === variant.id ? { ...l, quantity: l.quantity + 1 } : l,
        );
      }
      return [
        ...prev,
        {
          variantId: variant.id as string,
          productName: variant.productName || variant.sku,
          sku: variant.sku,
          sizeLabel: variant.sizeLabel,
          unitPrice: Number(variant.salePrice),
          quantity: 1,
        },
      ];
    });
  };

  const handleSaveEditedItems = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingOrder || inFlightRef.current) return;
    inFlightRef.current = true;
    setIsBusy(true);
    try {
      const updated = await pdvService.updateOrderItems(editingOrder.orderCode, {
        items: editLines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
        discountAmount: Number(editDiscount) || 0,
        notes: editNotes.trim() || undefined,
      });
      setEditingOrder(null);
      setSelectedOrder(updated);
      toast.success(PDV_TEXTS.SALES_EDITED_OK);
      await fetchOrders(updated.orderCode);
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.SALES_ACTION_ERROR));
    } finally {
      inFlightRef.current = false;
      setIsBusy(false);
    }
  };

  const handleCopyWhatsapp = async () => {
    if (!selectedOrder?.whatsappSummaryText) return;
    await navigator.clipboard.writeText(selectedOrder.whatsappSummaryText);
    toast.success(PDV_TEXTS.SALES_COPIED_WA);
  };

  const openCheckout = () => {
    if (!selectedOrder) return;
    setCheckoutOrder(selectedOrder);
    setPayments([{ paymentMethod: 'PIX', amount: Number(selectedOrder.totalAmount).toFixed(2) }]);
    setCheckoutNotes(selectedOrder.notes || '');
  };

  const closeCheckout = () => {
    if (isBusy) return;
    setCheckoutOrder(null);
  };

  const handleConfirmCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!checkoutOrder || inFlightRef.current) return;

    const totalExpected = Number(checkoutOrder.totalAmount);
    const sum = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    if (Math.abs(totalExpected - sum) > 0.009) {
      toast.error(PDV_TEXTS.CHECKOUT_SUM_ERROR);
      return;
    }

    inFlightRef.current = true;
    setIsBusy(true);
    try {
      const confirmed = await pdvService.confirmOrder(checkoutOrder.orderCode, {
        payments: payments.map((p) => ({
          paymentMethod: p.paymentMethod,
          amount: Number(p.amount) || 0,
        })),
        notes: checkoutNotes.trim() || undefined,
      });
      setCheckoutOrder(null);
      setSelectedOrder(confirmed);
      setReceiptOrder(confirmed);
      toast.success(PDV_TEXTS.SALES_CONFIRMED_OK);
      await fetchOrders(confirmed.orderCode);
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.SALES_ACTION_ERROR));
    } finally {
      inFlightRef.current = false;
      setIsBusy(false);
    }
  };

  const handleReactivate = async () => {
    if (!selectedOrder || inFlightRef.current) return;
    inFlightRef.current = true;
    setIsBusy(true);
    try {
      const updated = await pdvService.reactivateOrder(selectedOrder.orderCode);
      setSelectedOrder(updated);
      toast.success(PDV_TEXTS.SALES_REACTIVATED_OK);
      await fetchOrders(updated.orderCode);
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.SALES_ACTION_ERROR));
    } finally {
      inFlightRef.current = false;
      setIsBusy(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder || inFlightRef.current) return;
    inFlightRef.current = true;
    setIsBusy(true);
    try {
      const updated = await pdvService.cancelAdminOrder(selectedOrder.orderCode);
      setSelectedOrder(updated);
      toast.success(PDV_TEXTS.SALES_CANCELLED_OK);
      await fetchOrders(updated.orderCode);
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.SALES_ACTION_ERROR));
    } finally {
      inFlightRef.current = false;
      setIsBusy(false);
    }
  };

  return {
    orders,
    selectedOrder,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    isLoading,
    isBusy,
    refresh: () => fetchOrders(),
    handleSelectOrder,
    handleStartNegotiating,
    handleCopyWhatsapp,
    handleReactivate,
    handleCancelOrder,
    editingOrder,
    editLines,
    editDiscount,
    setEditDiscount,
    editNotes,
    setEditNotes,
    variantSearchQuery,
    setVariantSearchQuery,
    variantResults,
    openEditor,
    closeEditor,
    handleSearchVariantsForEdit,
    handleAddVariantToEdit,
    updateEditLineQty: (variantId: string, qty: number) =>
      setEditLines((prev) =>
        prev.map((l) => (l.variantId === variantId ? { ...l, quantity: Math.max(1, qty) } : l)),
      ),
    removeEditLine: (variantId: string) =>
      setEditLines((prev) => (prev.length > 1 ? prev.filter((l) => l.variantId !== variantId) : prev)),
    handleSaveEditedItems,
    checkoutOrder,
    payments,
    checkoutNotes,
    setCheckoutNotes,
    openCheckout,
    closeCheckout,
    addPaymentLine: () => setPayments((prev) => [...prev, { paymentMethod: 'CASH', amount: '' }]),
    removePaymentLine: (idx: number) =>
      setPayments((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev)),
    updatePaymentLine: (idx: number, field: keyof PaymentLineInput, value: string) =>
      setPayments((prev) => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))),
    handleConfirmCheckout,
    receiptOrder,
    setReceiptOrder,
  };
};
