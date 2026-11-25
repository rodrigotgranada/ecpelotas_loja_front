'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { storefrontService, CustomerOrder } from '../services/storefront.service';
import { STOREFRONT_TEXTS } from '../constants/storefront.constants';
import { extractStorefrontError } from '../utils/storefront.formatters';

export const useMyOrders = () => {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingCode, setCancellingCode] = useState<string | null>(null);

  const isLoggedIn = Boolean(hasHydrated && user && accessToken);

  const fetchOrders = useCallback(async () => {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const list = await storefrontService.listMyOrders();
      setOrders(list);
    } catch (error) {
      toast.error(extractStorefrontError(error, STOREFRONT_TEXTS.MY_ORDERS_EMPTY));
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!hasHydrated) return;
    const timer = setTimeout(() => {
      void fetchOrders();
    }, 0);
    return () => clearTimeout(timer);
  }, [hasHydrated, fetchOrders]);

  const handleCancelOrder = async (orderCode: string) => {
    setCancellingCode(orderCode);
    try {
      const updated = await storefrontService.cancelMyOrder(orderCode);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      toast.success(STOREFRONT_TEXTS.MY_ORDERS_CANCEL_SUCCESS);
    } catch (error) {
      toast.error(extractStorefrontError(error, STOREFRONT_TEXTS.MY_ORDERS_CANCEL_ERROR));
    } finally {
      setCancellingCode(null);
    }
  };

  return {
    orders,
    isLoading,
    hasHydrated,
    isLoggedIn,
    cancellingCode,
    handleCancelOrder,
  };
};
