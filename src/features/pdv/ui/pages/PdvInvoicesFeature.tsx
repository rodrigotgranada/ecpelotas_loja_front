'use client';

import React from 'react';
import { Upload, CheckCircle2, FileText, Search, Plus } from 'lucide-react';
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
import { usePdvInvoices } from '../../hooks/usePdvInvoices';
import { formatCurrencyBrl, formatDateTimeBrt } from '../../utils/pdv.formatters';
import { PdvShell } from '../components/PdvShell';
import { CreateFromInvoiceModal } from '../components/CreateFromInvoiceModal';

export const PdvInvoicesFeature = () => {
  const {
    invoices,
    selectedInvoice,
    categories,
    isLoading,
    isImportingXml,
    isConfirming,
    xmlInputRef,
    skuSearchByItem,
    skuMatchesByItem,
    linkingItemId,
    createModalItem,
    createForm,
    isCreatingProduct,
    handleImportXmlClick,
    handleXmlFileChange,
    handleSelectInvoice,
    updateItemSkuSearch,
    handleSearchVariantForItem,
    handleLinkVariant,
    openCreateFromItemModal,
    closeCreateFromItemModal,
    updateCreateFormField,
    handleCreateProductFromItem,
    handleConfirmInvoice,
  } = usePdvInvoices();

  return (
    <PdvShell>
      <LayoutContainer className="space-y-6">
        <LayoutContainer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Title level="h1" className="text-2xl font-extrabold text-text-primary">
            {PDV_TEXTS.INVOICES_TITLE}
          </Title>

          <LayoutContainer>
            <Input
              ref={xmlInputRef}
              type="file"
              accept=".xml,application/xml,text/xml"
              onChange={handleXmlFileChange}
              className="hidden"
            />
            <Button
              variant="primary"
              onClick={handleImportXmlClick}
              disabled={isImportingXml}
            >
              <Upload className="w-4 h-4" />
              {isImportingXml ? PDV_TEXTS.INVOICES_UPLOADING : PDV_TEXTS.INVOICES_UPLOAD_BTN}
            </Button>
          </LayoutContainer>
        </LayoutContainer>

        {isLoading ? (
          <Spinner text={PDV_TEXTS.INVOICES_LOADING} />
        ) : invoices.length === 0 ? (
          <LayoutContainer className="bg-surface border border-border rounded-2xl p-10 text-center space-y-3">
            <FileText className="w-10 h-10 text-primary mx-auto opacity-80" />
            <Text className="text-sm text-text-secondary">{PDV_TEXTS.INVOICES_EMPTY}</Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Document List */}
            <LayoutContainer className="lg:col-span-4 space-y-3">
              {invoices.map((doc) => {
                const isSelected = selectedInvoice?.id === doc.id;
                const isDraft = doc.status === 'DRAFT';
                return (
                  <Button
                    key={doc.id}
                    variant="outline"
                    onClick={() => handleSelectInvoice(doc)}
                    className={`w-full flex-col items-start text-left p-4 h-auto rounded-2xl ${
                      isSelected ? 'border-primary bg-surface' : 'bg-surface/60'
                    }`}
                  >
                    <LayoutContainer className="w-full flex items-center justify-between gap-2">
                      <Text as="span" className="text-sm font-bold text-text-primary">
                        {doc.invoiceNumber ? `NF-e ${doc.invoiceNumber}` : doc.docType}
                      </Text>
                      <Badge variant={isDraft ? 'warning' : 'success'}>
                        {isDraft ? PDV_TEXTS.INVOICES_STATUS_DRAFT : PDV_TEXTS.INVOICES_STATUS_POSTED}
                      </Badge>
                    </LayoutContainer>
                    <Text className="text-xs text-text-secondary truncate w-full">
                      {doc.supplierName || doc.notes || PDV_TEXTS.INVOICES_NO_ACCESS_KEY}
                    </Text>
                    <LayoutContainer className="w-full flex items-center justify-between text-xs text-text-secondary pt-1">
                      <Text as="span" className="text-xs text-text-secondary">
                        {formatDateTimeBrt(doc.createdAt)}
                      </Text>
                      <Text as="span" className="text-xs font-semibold text-primary">
                        {formatCurrencyBrl(doc.totalCost)}
                      </Text>
                    </LayoutContainer>
                  </Button>
                );
              })}
            </LayoutContainer>

            {/* Selected Document Detail */}
            <LayoutContainer className="lg:col-span-8 bg-surface border border-border rounded-2xl p-5 sm:p-6 space-y-5">
              {!selectedInvoice ? (
                <Text className="text-sm text-text-secondary">{PDV_TEXTS.INVOICES_SELECT_PROMPT}</Text>
              ) : (
                <>
                  <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <LayoutContainer className="space-y-1">
                      <LayoutContainer className="flex flex-wrap items-center gap-2">
                        <Title level="h2" className="text-xl font-bold text-text-primary">
                          {selectedInvoice.invoiceNumber
                            ? `NF-e ${selectedInvoice.invoiceNumber}`
                            : selectedInvoice.docType}
                        </Title>
                        <Badge variant={selectedInvoice.status === 'DRAFT' ? 'warning' : 'success'}>
                          {selectedInvoice.status === 'DRAFT'
                            ? PDV_TEXTS.INVOICES_STATUS_DRAFT
                            : PDV_TEXTS.INVOICES_STATUS_POSTED}
                        </Badge>
                      </LayoutContainer>
                      <Text className="text-xs text-text-secondary">
                        {selectedInvoice.supplierName || selectedInvoice.notes}
                      </Text>
                      {selectedInvoice.postedAt && (
                        <Text className="text-xs text-text-secondary">
                          {PDV_TEXTS.INVOICES_POSTED_AT_LABEL}: {formatDateTimeBrt(selectedInvoice.postedAt)}
                        </Text>
                      )}
                    </LayoutContainer>

                    {selectedInvoice.status === 'DRAFT' && (
                      <Button
                        variant="primary"
                        onClick={handleConfirmInvoice}
                        disabled={!selectedInvoice.allItemsLinked || isConfirming}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {isConfirming ? PDV_TEXTS.BTN_SAVING : PDV_TEXTS.INVOICES_CONFIRM_BTN}
                      </Button>
                    )}
                  </LayoutContainer>

                  {selectedInvoice.status === 'DRAFT' && !selectedInvoice.allItemsLinked && (
                    <LayoutContainer className="p-3 rounded-xl bg-warning/10 border border-warning/30">
                      <Text className="text-xs text-warning font-medium">
                        {PDV_TEXTS.INVOICES_PENDING_LINK_WARNING}
                      </Text>
                    </LayoutContainer>
                  )}

                  <LayoutContainer className="space-y-3">
                    {selectedInvoice.items.map((item) => {
                      const matches = skuMatchesByItem[item.id] || [];
                      return (
                        <LayoutContainer
                          key={item.id}
                          className="p-4 rounded-xl bg-background border border-border space-y-3"
                        >
                          <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <LayoutContainer className="space-y-1">
                              <Text className="text-sm font-bold text-text-primary">
                                #{item.lineNumber} · {item.supplierProductName}
                              </Text>
                              <Text className="text-xs text-text-secondary">
                                {PDV_TEXTS.INVOICES_QTY_LABEL}: {item.quantity} ·{' '}
                                {PDV_TEXTS.INVOICES_UNIT_COST_LABEL}: {formatCurrencyBrl(item.unitCost)} ·{' '}
                                {PDV_TEXTS.INVOICES_TOTAL_LABEL}: {formatCurrencyBrl(item.totalCost)}
                                {item.eanBarcode ? ` · ${PDV_TEXTS.INVOICES_EAN_LABEL}: ${item.eanBarcode}` : ''}
                              </Text>
                            </LayoutContainer>

                            <Badge variant={item.linkedVariantId ? 'success' : 'danger'}>
                              {item.linkedVariantId
                                ? `${PDV_TEXTS.INVOICES_LINKED_BADGE}: ${item.linkedVariantSku || ''} (${item.linkedSizeLabel || ''})`
                                : PDV_TEXTS.INVOICES_PENDING_BADGE}
                            </Badge>
                          </LayoutContainer>

                          {selectedInvoice.status === 'DRAFT' && !item.linkedVariantId && (
                            <LayoutContainer className="pt-2 border-t border-border/60 space-y-2.5">
                              <LayoutContainer className="flex flex-col sm:flex-row gap-2">
                                <Input
                                  value={skuSearchByItem[item.id] || ''}
                                  onChange={(e) => updateItemSkuSearch(item.id, e.target.value)}
                                  placeholder={PDV_TEXTS.INVOICES_SEARCH_SKU_PLACEHOLDER}
                                  className="py-1.5 text-xs"
                                />
                                <Button
                                  variant="outline"
                                  onClick={() => handleSearchVariantForItem(item.id)}
                                  className="px-3 py-1.5 text-xs shrink-0"
                                >
                                  <Search className="w-3.5 h-3.5" />
                                  {PDV_TEXTS.INVOICES_BTN_SEARCH}
                                </Button>
                                <Button
                                  variant="primary"
                                  onClick={() => openCreateFromItemModal(item)}
                                  className="px-3 py-1.5 text-xs shrink-0"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  {PDV_TEXTS.INVOICES_CREATE_PRODUCT}
                                </Button>
                              </LayoutContainer>

                              {matches.length > 0 && (
                                <LayoutContainer className="flex flex-wrap gap-2">
                                  {matches.map((variant) => (
                                    <Button
                                      key={variant.id || variant.sku}
                                      variant="outline"
                                      disabled={!variant.id || linkingItemId === item.id}
                                      onClick={() =>
                                        variant.id &&
                                        handleLinkVariant(selectedInvoice.id, item.id, variant.id)
                                      }
                                      className="px-2.5 py-1 text-xs"
                                    >
                                      {variant.productName} ({variant.sizeLabel}) · {variant.sku}
                                    </Button>
                                  ))}
                                </LayoutContainer>
                              )}
                            </LayoutContainer>
                          )}
                        </LayoutContainer>
                      );
                    })}
                  </LayoutContainer>
                </>
              )}
            </LayoutContainer>
          </LayoutContainer>
        )}
      </LayoutContainer>

      <CreateFromInvoiceModal
        item={createModalItem}
        categories={categories}
        formState={createForm}
        isSubmitting={isCreatingProduct}
        onChangeField={updateCreateFormField}
        onClose={closeCreateFromItemModal}
        onSubmit={handleCreateProductFromItem}
      />
    </PdvShell>
  );
};
