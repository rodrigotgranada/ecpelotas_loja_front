'use client';

import { useState, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  pdvService,
  ProductVariantItem,
  MemberLookupDto,
  AdminOrderDto,
} from '../services/pdv.service';
import { PDV_TEXTS } from '../constants/pdv.constants';
import { extractApiError } from '../utils/pdv.formatters';
import { PaymentLineInput } from '../ui/components/PaymentLinesBuilder';

export interface CounterCartLine {
  variantId: string;
  productName: string;
  sku: string;
  sizeLabel: string;
  salePrice: number;
  memberPrice?: number | null;
  availableStock: number;
  quantity: number;
}

export const usePdvCounterSale = () => {
  const [scanQuery, setScanQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductVariantItem[]>([]);
  const [cartLines, setCartLines] = useState<CounterCartLine[]>([]);

  const [customerMode, setCustomerMode] = useState<'ANON' | 'CPF'>('ANON');
  const [customerCpf, setCustomerCpf] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [memberInfo, setMemberInfo] = useState<MemberLookupDto | null>(null);
  const [isCheckingCpf, setIsCheckingCpf] = useState(false);

  const [discountAmount, setDiscountAmount] = useState('0');
  const [notes, setNotes] = useState('');
  const [payments, setPayments] = useState<PaymentLineInput[]>([{ paymentMethod: 'PIX', amount: '' }]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<AdminOrderDto | null>(null);
  const inFlightRef = useRef(false);

  const isSocioActive = Boolean(customerMode === 'CPF' && memberInfo?.isSocioActive);

  const totals = useMemo(() => {
    let rawSubtotal = 0;
    let afterSocio = 0;
    for (const line of cartLines) {
      const unit = line.salePrice;
      const member =
        line.memberPrice !== null && line.memberPrice !== undefined && line.memberPrice > 0 && line.memberPrice < unit
          ? line.memberPrice
          : unit;
      const applied = isSocioActive ? member : unit;
      rawSubtotal += unit * line.quantity;
      afterSocio += applied * line.quantity;
    }
    const extraDiscount = Math.min(afterSocio, Math.max(0, Number(discountAmount) || 0));
    const finalTotal = Math.max(0, afterSocio - extraDiscount);
    return {
      subtotal: rawSubtotal,
      discount: rawSubtotal - afterSocio + extraDiscount,
      total: Number(finalTotal.toFixed(2)),
    };
  }, [cartLines, isSocioActive, discountAmount]);

  const addVariantToCounter = (variant: ProductVariantItem) => {
    if (!variant.id || (variant.availableStock ?? 0) <= 0) return;
    setCartLines((prev) => {
      const existing = prev.find((l) => l.variantId === variant.id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + 1, variant.availableStock ?? 1);
        return prev.map((l) => (l.variantId === variant.id ? { ...l, quantity: nextQty } : l));
      }
      return [
        ...prev,
        {
          variantId: variant.id as string,
          productName: variant.productName || variant.sku,
          sku: variant.sku,
          sizeLabel: variant.sizeLabel,
          salePrice: Number(variant.salePrice),
          memberPrice: variant.memberPrice != null ? Number(variant.memberPrice) : null,
          availableStock: variant.availableStock ?? 0,
          quantity: 1,
        },
      ];
    });
  };

  const handleSearchOrScan = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const q = scanQuery.trim();
    if (!q) return;
    try {
      const matches = await pdvService.searchVariants(q);
      setSearchResults(matches);
      if (
        matches.length === 1 &&
        (matches[0].eanBarcode === q || matches[0].sku.toLowerCase() === q.toLowerCase()) &&
        (matches[0].availableStock ?? 0) > 0
      ) {
        addVariantToCounter(matches[0]);
        setScanQuery('');
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    }
  };

  const handleCheckCpf = async () => {
    const clean = customerCpf.replace(/\D/g, '');
    if (clean.length !== 11) return;
    setIsCheckingCpf(true);
    try {
      const info = await pdvService.checkMemberByCpf(clean);
      setMemberInfo(info);
      if (info.found && info.name && !customerName.trim()) {
        setCustomerName(info.name);
      }
    } catch {
      setMemberInfo(null);
    } finally {
      setIsCheckingCpf(false);
    }
  };

  const handleSwitchMode = (mode: 'ANON' | 'CPF') => {
    setCustomerMode(mode);
    if (mode === 'ANON') {
      setMemberInfo(null);
      setCustomerCpf('');
    }
  };

  const syncSinglePaymentWithTotal = (newTotal: number) => {
    if (payments.length === 1) {
      setPayments([{ paymentMethod: payments[0].paymentMethod, amount: newTotal.toFixed(2) }]);
    }
  };

  const handleSubmitSale = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlightRef.current || cartLines.length === 0) return;

    const sum = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    if (Math.abs(totals.total - sum) > 0.009) {
      toast.error(PDV_TEXTS.CHECKOUT_SUM_ERROR);
      return;
    }

    inFlightRef.current = true;
    setIsSubmitting(true);
    try {
      const created = await pdvService.createCounterSale({
        customerType: customerMode === 'CPF' ? 'REGISTERED' : 'WALK_IN_ANONYMOUS',
        customerCpf: customerMode === 'CPF' ? customerCpf.replace(/\D/g, '') : undefined,
        customerName: customerName.trim() || undefined,
        discountAmount: Number(discountAmount) || 0,
        notes: notes.trim() || undefined,
        items: cartLines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
        payments: payments.map((p) => ({
          paymentMethod: p.paymentMethod,
          amount: Number(p.amount) || 0,
        })),
      });
      toast.success(PDV_TEXTS.COUNTER_SUCCESS);
      setReceiptOrder(created);
      setCartLines([]);
      setSearchResults([]);
      setCustomerCpf('');
      setCustomerName('');
      setMemberInfo(null);
      setDiscountAmount('0');
      setNotes('');
      setPayments([{ paymentMethod: 'PIX', amount: '' }]);
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.SALES_ACTION_ERROR));
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    scanQuery,
    setScanQuery,
    searchResults,
    cartLines,
    customerMode,
    customerCpf,
    setCustomerCpf,
    customerName,
    setCustomerName,
    memberInfo,
    isCheckingCpf,
    isSocioActive,
    discountAmount,
    setDiscountAmount,
    notes,
    setNotes,
    payments,
    totals,
    isSubmitting,
    receiptOrder,
    setReceiptOrder,
    handleSearchOrScan,
    addVariantToCounter,
    updateCartQty: (variantId: string, qty: number) =>
      setCartLines((prev) =>
        prev.map((l) =>
          l.variantId === variantId
            ? { ...l, quantity: Math.max(1, Math.min(qty, l.availableStock)) }
            : l,
        ),
      ),
    removeCartLine: (variantId: string) =>
      setCartLines((prev) => prev.filter((l) => l.variantId !== variantId)),
    handleSwitchMode,
    handleCheckCpf,
    addPaymentLine: () => setPayments((prev) => [...prev, { paymentMethod: 'CASH', amount: '' }]),
    removePaymentLine: (idx: number) =>
      setPayments((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev)),
    updatePaymentLine: (idx: number, field: keyof PaymentLineInput, value: string) =>
      setPayments((prev) => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))),
    fillFullTotalPayment: () => syncSinglePaymentWithTotal(totals.total),
    handleSubmitSale,
  };
};
