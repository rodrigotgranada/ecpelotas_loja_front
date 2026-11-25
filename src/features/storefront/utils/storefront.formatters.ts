import axios from 'axios';
import { BadgeVariant } from '@/shared/ui/components';
import { STOREFRONT_TEXTS } from '../constants/storefront.constants';

export const formatCurrencyBrl = (value?: number | null): string => {
  if (value === null || value === undefined || Number.isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const formatDateTimeBrt = (isoDate?: string | null): string => {
  if (!isoDate) return '-';
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsed);
};

export const extractStorefrontError = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error)) return fallback;
  const data = error.response?.data as { detail?: string; message?: string; title?: string } | undefined;
  return data?.detail || data?.message || data?.title || fallback;
};

export const getOrderStatusMeta = (status: string): { label: string; variant: BadgeVariant } => {
  switch (status) {
    case 'PENDING_WHATSAPP':
      return { label: STOREFRONT_TEXTS.STATUS_PENDING_WHATSAPP, variant: 'warning' };
    case 'NEGOTIATING':
      return { label: STOREFRONT_TEXTS.STATUS_NEGOTIATING, variant: 'primary' };
    case 'CONFIRMED_PAID':
      return { label: STOREFRONT_TEXTS.STATUS_CONFIRMED_PAID, variant: 'success' };
    case 'CANCELLED':
      return { label: STOREFRONT_TEXTS.STATUS_CANCELLED, variant: 'danger' };
    case 'EXPIRED':
      return { label: STOREFRONT_TEXTS.STATUS_EXPIRED, variant: 'default' };
    default:
      return { label: status, variant: 'default' };
  }
};
