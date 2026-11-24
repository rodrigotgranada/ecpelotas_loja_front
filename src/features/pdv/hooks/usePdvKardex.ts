'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { pdvService, StockMovement } from '../services/pdv.service';
import { PDV_TEXTS } from '../constants/pdv.constants';
import { extractApiError } from '../utils/pdv.formatters';

export const usePdvKardex = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [filterText, setFilterText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchMovements = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await pdvService.listKardex(undefined, 1, 100);
      setMovements(res.data);
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.KARDEX_EMPTY));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchMovements();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchMovements]);

  const filteredMovements = useMemo(() => {
    const query = filterText.trim().toLowerCase();
    if (!query) return movements;
    return movements.filter(
      (item) =>
        item.sku.toLowerCase().includes(query) ||
        item.productName.toLowerCase().includes(query) ||
        (item.reason || '').toLowerCase().includes(query),
    );
  }, [movements, filterText]);

  return {
    movements: filteredMovements,
    filterText,
    setFilterText,
    isLoading,
    refresh: fetchMovements,
  };
};
