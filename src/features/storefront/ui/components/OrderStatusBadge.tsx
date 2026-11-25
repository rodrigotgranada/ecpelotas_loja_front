'use client';

import React from 'react';
import { Badge } from '@/shared/ui/components';
import { getOrderStatusMeta } from '../../utils/storefront.formatters';

export const OrderStatusBadge = ({ status }: { status: string }) => {
  const meta = getOrderStatusMeta(status);
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
};
