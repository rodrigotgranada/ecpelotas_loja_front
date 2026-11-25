'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { pdvService, StoreSettingsPayload } from '../services/pdv.service';
import { PDV_TEXTS } from '../constants/pdv.constants';
import { extractApiError } from '../utils/pdv.formatters';

const INITIAL_SETTINGS: StoreSettingsPayload = {
  storeName: 'Loja Oficial Alcateia',
  whatsappNumber: '5553999999999',
  openHour: '09:00',
  closeHour: '19:00',
  workingDays: 'MON,TUE,WED,THU,FRI,SAT',
  reservationTtlMinutes: 180,
  maxOpenReservationsPerUser: 2,
};

export const usePdvSettings = () => {
  const [settings, setSettings] = useState<StoreSettingsPayload>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const inFlightRef = useRef(false);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await pdvService.getStoreSettings();
      setSettings(data);
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.SETTINGS_SAVE_ERROR));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadSettings();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadSettings]);

  const updateField = <K extends keyof StoreSettingsPayload>(
    field: K,
    value: StoreSettingsPayload[K],
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsSaving(true);

    try {
      const updated = await pdvService.updateStoreSettings(settings);
      setSettings(updated);
      toast.success(PDV_TEXTS.SETTINGS_SAVE_SUCCESS);
    } catch (error) {
      toast.error(extractApiError(error, PDV_TEXTS.SETTINGS_SAVE_ERROR));
    } finally {
      inFlightRef.current = false;
      setIsSaving(false);
    }
  };

  return {
    settings,
    isLoading,
    isSaving,
    updateField,
    handleSubmit,
  };
};
