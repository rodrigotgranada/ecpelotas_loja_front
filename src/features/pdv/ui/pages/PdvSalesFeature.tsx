'use client';

import React from 'react';
import { RefreshCw, Search, MessageSquare } from 'lucide-react';
import { LayoutContainer, Title, Text, Button, Input, Spinner } from '@/shared/ui/components';
import { PDV_TEXTS } from '../../constants/pdv.constants';
import { usePdvSales } from '../../hooks/usePdvSales';
import { PdvShell } from '../components/PdvShell';
import { OrderQueueList } from '../components/OrderQueueList';
import { OrderDetailPanel } from '../components/OrderDetailPanel';
import { OrderEditorModal } from '../components/OrderEditorModal';
import { OrderCheckoutModal } from '../components/OrderCheckoutModal';
import { OrderReceiptModal } from '../components/OrderReceiptModal';

const STATUS_TABS = [
  { value: 'PENDING_WHATSAPP', label: PDV_TEXTS.SALES_TAB_PENDING },
  { value: 'NEGOTIATING', label: PDV_TEXTS.SALES_TAB_NEGOTIATING },
  { value: 'CONFIRMED_PAID', label: PDV_TEXTS.SALES_TAB_CONFIRMED },
  { value: 'EXPIRED', label: PDV_TEXTS.SALES_TAB_EXPIRED },
  { value: 'CANCELLED', label: PDV_TEXTS.SALES_TAB_CANCELLED },
  { value: '', label: PDV_TEXTS.SALES_TAB_ALL },
] as const;

export const PdvSalesFeature = () => {
  const sales = usePdvSales();

  return (
    <PdvShell>
      <LayoutContainer className="space-y-6">
        <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <LayoutContainer className="space-y-1">
            <Title level="h1" className="text-2xl font-extrabold text-text-primary">
              {PDV_TEXTS.SALES_TITLE}
            </Title>
            <Text className="text-xs sm:text-sm text-text-secondary">{PDV_TEXTS.SALES_SUBTITLE}</Text>
          </LayoutContainer>

          <Button variant="outline" onClick={sales.refresh} disabled={sales.isLoading}>
            <RefreshCw className="w-4 h-4" />
            {PDV_TEXTS.SALES_REFRESH_BTN}
          </Button>
        </LayoutContainer>

        <LayoutContainer className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <Button
              key={tab.label}
              variant={sales.statusFilter === tab.value ? 'primary' : 'outline'}
              onClick={() => sales.setStatusFilter(tab.value)}
              className="px-3 py-1.5 text-xs"
            >
              {tab.label}
            </Button>
          ))}
        </LayoutContainer>

        <LayoutContainer className="relative flex items-center">
          <Search className="w-4 h-4 text-text-secondary absolute left-3.5 pointer-events-none" />
          <Input
            value={sales.search}
            onChange={(e) => sales.setSearch(e.target.value)}
            placeholder={PDV_TEXTS.SALES_SEARCH_PLACEHOLDER}
            className="pl-10"
          />
        </LayoutContainer>

        {sales.isLoading ? (
          <Spinner text={PDV_TEXTS.SALES_LOADING} />
        ) : sales.orders.length === 0 ? (
          <LayoutContainer className="bg-surface border border-border rounded-2xl p-10 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-primary mx-auto opacity-80" />
            <Text className="text-sm text-text-secondary">{PDV_TEXTS.SALES_EMPTY}</Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <OrderQueueList
              orders={sales.orders}
              selectedOrderId={sales.selectedOrder?.id}
              onSelect={sales.handleSelectOrder}
            />
            <OrderDetailPanel
              order={sales.selectedOrder}
              isBusy={sales.isBusy}
              onStartNegotiating={sales.handleStartNegotiating}
              onOpenEditor={sales.openEditor}
              onCopyWhatsapp={sales.handleCopyWhatsapp}
              onOpenCheckout={sales.openCheckout}
              onReactivate={sales.handleReactivate}
              onCancelOrder={sales.handleCancelOrder}
              onOpenReceipt={() => sales.setReceiptOrder(sales.selectedOrder)}
            />
          </LayoutContainer>
        )}
      </LayoutContainer>

      <OrderEditorModal
        order={sales.editingOrder}
        lines={sales.editLines}
        discountAmount={sales.editDiscount}
        notes={sales.editNotes}
        searchQuery={sales.variantSearchQuery}
        searchResults={sales.variantResults}
        isSubmitting={sales.isBusy}
        onChangeDiscount={sales.setEditDiscount}
        onChangeNotes={sales.setEditNotes}
        onChangeSearch={sales.setVariantSearchQuery}
        onSearchVariants={sales.handleSearchVariantsForEdit}
        onAddVariant={sales.handleAddVariantToEdit}
        onChangeLineQty={sales.updateEditLineQty}
        onRemoveLine={sales.removeEditLine}
        onClose={sales.closeEditor}
        onSubmit={sales.handleSaveEditedItems}
      />

      <OrderCheckoutModal
        order={sales.checkoutOrder}
        payments={sales.payments}
        notes={sales.checkoutNotes}
        isSubmitting={sales.isBusy}
        onChangeNotes={sales.setCheckoutNotes}
        onAddPaymentLine={sales.addPaymentLine}
        onRemovePaymentLine={sales.removePaymentLine}
        onUpdatePaymentLine={sales.updatePaymentLine}
        onClose={sales.closeCheckout}
        onSubmit={sales.handleConfirmCheckout}
      />

      <OrderReceiptModal
        order={sales.receiptOrder}
        onClose={() => sales.setReceiptOrder(null)}
      />
    </PdvShell>
  );
};
