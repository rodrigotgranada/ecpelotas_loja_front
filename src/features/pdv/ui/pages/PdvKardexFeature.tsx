'use client';

import React from 'react';
import { RefreshCw, History, Search } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Input,
  Spinner,
} from '@/shared/ui/components';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { usePdvKardex } from '../../hooks/usePdvKardex';
import { formatDateTimeBrt } from '../../utils/pdv.formatters';
import { PdvShell } from '../components/PdvShell';

export const PdvKardexFeature = () => {
  const { movements, filterText, setFilterText, isLoading, refresh } = usePdvKardex();

  return (
    <PdvShell>
      <LayoutContainer className="space-y-6">
        <LayoutContainer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Title level="h1" className="text-2xl font-extrabold text-text-primary">
            {PDV_TEXTS.KARDEX_TITLE}
          </Title>
          <Button variant="outline" onClick={refresh} disabled={isLoading}>
            <RefreshCw className="w-4 h-4" />
            {PDV_TEXTS.KARDEX_FILTER_BTN}
          </Button>
        </LayoutContainer>

        <LayoutContainer className="relative flex items-center">
          <Search className="w-4 h-4 text-text-secondary absolute left-3.5 pointer-events-none" />
          <Input
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder={PDV_TEXTS.KARDEX_FILTER_SKU_PLACEHOLDER}
            className="pl-10"
          />
        </LayoutContainer>

        {isLoading ? (
          <Spinner text={PDV_TEXTS.KARDEX_LOADING} />
        ) : movements.length === 0 ? (
          <LayoutContainer className="bg-surface border border-border rounded-2xl p-10 text-center space-y-3">
            <History className="w-10 h-10 text-primary mx-auto opacity-80" />
            <Text className="text-sm text-text-secondary">{PDV_TEXTS.KARDEX_EMPTY}</Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="space-y-3">
            {movements.map((mov) => {
              const isPositive = mov.quantityDelta > 0;
              return (
                <LayoutContainer
                  key={mov.id}
                  className="bg-surface border border-border rounded-2xl p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                >
                  <LayoutContainer className="md:col-span-2">
                    <Text className="text-xs font-semibold text-text-secondary">
                      {PDV_TEXTS.KARDEX_COL_DATE}
                    </Text>
                    <Text className="text-xs text-text-primary">{formatDateTimeBrt(mov.createdAt)}</Text>
                  </LayoutContainer>

                  <LayoutContainer className="md:col-span-4 space-y-0.5">
                    <Text className="text-sm font-bold text-text-primary">
                      {mov.productName} ({mov.sizeLabel})
                    </Text>
                    <Text className="text-xs text-text-secondary">{mov.sku}</Text>
                  </LayoutContainer>

                  <LayoutContainer className="md:col-span-2 flex items-center gap-2">
                    <Badge variant={isPositive ? 'success' : 'danger'}>
                      {isPositive ? `+${mov.quantityDelta}` : mov.quantityDelta}
                    </Badge>
                    <Badge variant="default">{mov.movementType}</Badge>
                  </LayoutContainer>

                  <LayoutContainer className="md:col-span-2">
                    <Text className="text-xs text-text-secondary">{PDV_TEXTS.KARDEX_COL_BALANCE}</Text>
                    <Text className="text-sm font-bold text-text-primary">
                      {mov.balanceBefore} → {mov.balanceAfter}
                    </Text>
                  </LayoutContainer>

                  <LayoutContainer className="md:col-span-2 space-y-0.5">
                    <Text className="text-xs text-text-primary truncate">
                      {mov.reason || PDV_TEXTS.KARDEX_NO_REASON}
                    </Text>
                    <Text className="text-xs text-text-secondary truncate">{mov.actorName || '-'}</Text>
                  </LayoutContainer>
                </LayoutContainer>
              );
            })}
          </LayoutContainer>
        )}
      </LayoutContainer>
    </PdvShell>
  );
};
