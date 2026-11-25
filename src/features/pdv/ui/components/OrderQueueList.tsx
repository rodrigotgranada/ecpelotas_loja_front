'use client';

import React from 'react';
import { LayoutContainer, Text, Badge, Button } from '@/shared/ui/components';
import { AdminOrderDto } from '../../services/pdv.service';
import { formatCurrencyBrl, formatDateTimeBrt } from '../../utils/pdv.formatters';

export interface OrderQueueListProps {
  orders: AdminOrderDto[];
  selectedOrderId?: string | null;
  onSelect: (order: AdminOrderDto) => void;
}

export const OrderQueueList = ({ orders, selectedOrderId, onSelect }: OrderQueueListProps) => {
  return (
    <LayoutContainer className="lg:col-span-4 space-y-3">
      {orders.map((order) => {
        const isSelected = selectedOrderId === order.id;
        return (
          <Button
            key={order.id}
            variant="outline"
            onClick={() => onSelect(order)}
            className={`w-full flex-col items-start text-left p-4 h-auto rounded-2xl ${
              isSelected ? 'border-primary bg-surface' : 'bg-surface/60'
            }`}
          >
            <LayoutContainer className="w-full flex items-center justify-between gap-2">
              <Text as="span" className="text-sm font-extrabold text-text-primary">
                {order.orderCode}
              </Text>
              <Badge variant={order.status === 'CONFIRMED_PAID' ? 'success' : 'warning'}>
                {order.status}
              </Badge>
            </LayoutContainer>

            <Text className="text-xs text-text-primary truncate w-full">{order.customerName}</Text>

            <LayoutContainer className="w-full flex items-center justify-between pt-1">
              <Text as="span" className="text-xs text-text-secondary">
                {formatDateTimeBrt(order.createdAt)}
              </Text>
              <Text as="span" className="text-xs font-bold text-primary">
                {formatCurrencyBrl(order.totalAmount)}
              </Text>
            </LayoutContainer>
          </Button>
        );
      })}
    </LayoutContainer>
  );
};
