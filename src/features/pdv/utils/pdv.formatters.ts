import axios from 'axios';

export const formatCurrencyBrl = (value?: number | null): string => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
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

export const extractApiError = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error)) return fallback;
  const data = error.response?.data as { detail?: string; message?: string; title?: string } | undefined;
  return data?.detail || data?.message || data?.title || fallback;
};
