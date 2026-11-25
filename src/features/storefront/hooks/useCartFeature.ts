'use client';

import { useState, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { storefrontService, CustomerOrder } from '../services/storefront.service';
import { STOREFRONT_TEXTS } from '../constants/storefront.constants';
import { extractStorefrontError } from '../utils/storefront.formatters';

export const useCartFeature = () => {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<CustomerOrder | null>(null);
  const inFlightRef = useRef(false);

  const isLoggedIn = Boolean(hasHydrated && user && accessToken);
  const cleanCpf = (user?.cpf || '').replace(/\D/g, '');
  const hasValidCpf = cleanCpf.length === 11;
  const isSocioActive = Boolean(user?.isSocioActive);

  const portalBaseUrl = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:7999';

  const totals = useMemo(() => {
    let subtotal = 0;
    let total = 0;
    for (const item of items) {
      const unit = Number(item.salePrice);
      const member =
        item.memberPrice !== null && item.memberPrice !== undefined
          ? Number(item.memberPrice)
          : unit;
      const applied = isSocioActive && member > 0 && member < unit ? member : unit;
      subtotal += unit * item.quantity;
      total += applied * item.quantity;
    }
    return {
      subtotal,
      discount: subtotal - total,
      total,
    };
  }, [items, isSocioActive]);

  const handleSubmitReservation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlightRef.current || !isLoggedIn || !hasValidCpf || items.length === 0) return;

    const cleanWa = customerWhatsapp.trim();
    if (!cleanWa) {
      toast.error(STOREFRONT_TEXTS.CART_WHATSAPP_REQUIRED);
      return;
    }

    inFlightRef.current = true;
    setIsSubmitting(true);

    try {
      const order = await storefrontService.createWhatsappReservation({
        customerWhatsapp: cleanWa,
        notes: notes.trim() || undefined,
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      });
      setCreatedOrder(order);
      clearCart();
      toast.success(STOREFRONT_TEXTS.CART_SUBMIT_SUCCESS);
    } catch (error) {
      toast.error(extractStorefrontError(error, STOREFRONT_TEXTS.CART_SUBMIT_ERROR));
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    items,
    user,
    hasHydrated,
    isLoggedIn,
    hasValidCpf,
    isSocioActive,
    portalRegisterUrl: `${portalBaseUrl}/register`,
    portalProfileUrl: `${portalBaseUrl}/profile`,
    customerWhatsapp,
    setCustomerWhatsapp,
    notes,
    setNotes,
    totals,
    isSubmitting,
    createdOrder,
    updateQuantity,
    removeItem,
    handleSubmitReservation,
  };
};
