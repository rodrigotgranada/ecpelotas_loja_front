import { api } from '@/services/api';
import { StoreUser } from '@/store/useAuthStore';
import { uploadMedia } from '@/shared/services/media-upload.service';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  active: boolean;
}

export interface ProductVariantItem {
  id?: string;
  productId?: string;
  productName?: string;
  sku: string;
  eanBarcode?: string;
  sizeLabel: string;
  colorLabel?: string;
  costPrice: number;
  salePrice: number;
  memberPrice?: number | null;
  physicalStock?: number;
  reservedStock?: number;
  availableStock?: number;
  minStock?: number;
  lowStock?: boolean;
  active?: boolean;
}

export interface ProductItem {
  id: string;
  categoryId?: string;
  categoryName?: string;
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  coverImageUrl?: string | null;
  galleryUrls?: string[];
  featured: boolean;
  active: boolean;
  totalAvailableStock: number;
  variants: ProductVariantItem[];
}

export interface StockDocumentItem {
  id: string;
  lineNumber: number;
  supplierProductCode?: string;
  eanBarcode?: string;
  supplierProductName: string;
  ncm?: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  linkedVariantId?: string;
  linkedVariantSku?: string;
  linkedProductName?: string;
  linkedSizeLabel?: string;
}

export interface StockDocument {
  id: string;
  docType: string;
  status: 'DRAFT' | 'POSTED' | 'CANCELLED';
  invoiceNumber?: string;
  invoiceSeries?: string;
  accessKey44?: string;
  supplierCnpj?: string;
  supplierName?: string;
  notes?: string;
  totalCost: number;
  postedAt?: string;
  createdAt: string;
  allItemsLinked: boolean;
  items: StockDocumentItem[];
}

export interface StockMovement {
  id: string;
  variantId: string;
  sku: string;
  productName: string;
  sizeLabel: string;
  documentId?: string;
  movementType: string;
  quantityDelta: number;
  balanceBefore: number;
  balanceAfter: number;
  unitCost?: number;
  reason?: string;
  actorName?: string;
  createdAt: string;
}

export interface StoreSettingsPayload {
  storeName: string;
  whatsappNumber: string;
  openHour: string;
  closeHour: string;
  workingDays: string;
  reservationTtlMinutes: number;
  maxOpenReservationsPerUser: number;
}

export interface OrderItemDto {
  id: string;
  variantId: string;
  productName: string;
  sku: string;
  sizeLabel: string;
  colorLabel?: string;
  quantity: number;
  unitPrice: number;
  appliedPrice: number;
  lineTotal: number;
}

export interface OrderPaymentDto {
  id?: string;
  paymentMethod: string;
  amount: number;
}

export interface OrderEventDto {
  id: string;
  eventType: string;
  actorName?: string;
  description?: string;
  createdAt: string;
}

export interface AdminOrderDto {
  id: string;
  orderCode: string;
  channel: string;
  status: string;
  customerType: string;
  customerName: string;
  customerWhatsapp?: string;
  customerCpf?: string;
  isSocioDiscountApplied: boolean;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  notes?: string;
  whatsappSummaryText?: string;
  whatsappUrl?: string;
  expiresAt?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancelledReason?: string;
  createdAt: string;
  items: OrderItemDto[];
  payments: OrderPaymentDto[];
  events: OrderEventDto[];
}

export interface MemberLookupDto {
  found: boolean;
  portalUserId?: string;
  storeUserId?: string;
  cpf?: string;
  name?: string;
  isSocioActive: boolean;
  socioPlanName?: string;
  source?: string;
}

export const pdvService = {
  login: async (cpf: string, password: string): Promise<{ accessToken: string; user: StoreUser }> => {
    const res = await api.post<{ accessToken: string; user: StoreUser }>('/auth/login', { cpf, password });
    return res.data;
  },

  logout: async () => {
    await api.post('/auth/logout').catch(() => {});
  },

  listCategories: async (): Promise<CategoryItem[]> => {
    const res = await api.get<CategoryItem[]>('/admin/categories');
    return res.data;
  },

  listProducts: async (search?: string, page = 1, limit = 30) => {
    const res = await api.get<{ data: ProductItem[]; total: number }>('/admin/products', {
      params: { search: search || undefined, page, limit },
    });
    return res.data;
  },

  uploadProductImage: async (file: File): Promise<string> => {
    const res = await uploadMedia<{ url: string }>(file, {
      endpoint: '/admin/uploads/product-image',
      fieldName: 'file',
    });
    return res.url;
  },

  createProduct: async (payload: Partial<ProductItem> & { variants: ProductVariantItem[] }) => {
    const res = await api.post<ProductItem>('/admin/products', payload);
    return res.data;
  },

  updateProduct: async (id: string, payload: Partial<ProductItem> & { variants: ProductVariantItem[] }) => {
    const res = await api.put<ProductItem>(`/admin/products/${id}`, payload);
    return res.data;
  },

  searchVariants: async (q: string): Promise<ProductVariantItem[]> => {
    const res = await api.get<ProductVariantItem[]>('/admin/variants/search', { params: { q } });
    return res.data;
  },

  adjustStock: async (variantId: string, quantityDelta: number, reason: string) => {
    const res = await api.post<StockDocument>('/admin/stock/adjust', { variantId, quantityDelta, reason });
    return res.data;
  },

  listInvoices: async (page = 1, limit = 20) => {
    const res = await api.get<{ data: StockDocument[]; total: number }>('/admin/invoices', {
      params: { page, limit },
    });
    return res.data;
  },

  getInvoice: async (id: string): Promise<StockDocument> => {
    const res = await api.get<StockDocument>(`/admin/invoices/${id}`);
    return res.data;
  },

  importNfeXml: async (file: File): Promise<StockDocument> => {
    return uploadMedia<StockDocument>(file, {
      endpoint: '/admin/invoices/import-xml',
      fieldName: 'file',
    });
  },

  linkInvoiceItem: async (docId: string, itemId: string, variantId: string): Promise<StockDocument> => {
    const res = await api.patch<StockDocument>(`/admin/invoices/${docId}/items/${itemId}/link`, { variantId });
    return res.data;
  },

  createProductFromInvoiceItem: async (
    docId: string,
    itemId: string,
    payload: {
      productName: string;
      categoryId?: string;
      sku: string;
      eanBarcode?: string;
      sizeLabel: string;
      colorLabel?: string;
      salePrice: number;
      memberPrice?: number;
    },
  ): Promise<StockDocument> => {
    const res = await api.post<StockDocument>(`/admin/invoices/${docId}/items/${itemId}/create-product`, payload);
    return res.data;
  },

  confirmInvoice: async (docId: string): Promise<StockDocument> => {
    const res = await api.post<StockDocument>(`/admin/invoices/${docId}/confirm`);
    return res.data;
  },

  listKardex: async (variantId?: string, page = 1, limit = 40) => {
    const res = await api.get<{ data: StockMovement[]; total: number }>('/admin/stock/movements', {
      params: { variantId: variantId || undefined, page, limit },
    });
    return res.data;
  },

  listStaff: async (): Promise<StoreUser[]> => {
    const res = await api.get<StoreUser[]>('/admin/staff');
    return res.data;
  },

  createStaff: async (payload: {
    fullName: string;
    email?: string;
    cpf?: string;
    role: string;
    password: string;
    active: boolean;
  }): Promise<StoreUser> => {
    const res = await api.post<StoreUser>('/admin/staff', payload);
    return res.data;
  },

  updateStaff: async (
    id: string,
    payload: {
      fullName: string;
      email?: string;
      cpf?: string;
      role: string;
      password?: string;
      active: boolean;
    },
  ): Promise<StoreUser> => {
    const res = await api.put<StoreUser>(`/admin/staff/${id}`, payload);
    return res.data;
  },

  createCategory: async (payload: {
    name: string;
    description?: string;
    sortOrder?: number;
    active?: boolean;
  }): Promise<CategoryItem> => {
    const res = await api.post<CategoryItem>('/admin/categories', payload);
    return res.data;
  },

  updateCategory: async (
    id: string,
    payload: {
      name: string;
      description?: string;
      sortOrder?: number;
      active?: boolean;
    },
  ): Promise<CategoryItem> => {
    const res = await api.put<CategoryItem>(`/admin/categories/${id}`, payload);
    return res.data;
  },

  getStoreSettings: async (): Promise<StoreSettingsPayload> => {
    const res = await api.get<StoreSettingsPayload>('/admin/store-settings');
    return res.data;
  },

  updateStoreSettings: async (payload: StoreSettingsPayload): Promise<StoreSettingsPayload> => {
    const res = await api.put<StoreSettingsPayload>('/admin/store-settings', payload);
    return res.data;
  },

  listAdminOrders: async (status?: string, search?: string, page = 1, limit = 30) => {
    const res = await api.get<{ data: AdminOrderDto[]; total: number }>('/admin/orders', {
      params: { status: status || undefined, search: search || undefined, page, limit },
    });
    return res.data;
  },

  getAdminOrder: async (orderCode: string): Promise<AdminOrderDto> => {
    const cleanCode = orderCode.replace('#', '');
    const res = await api.get<AdminOrderDto>(`/admin/orders/${cleanCode}`);
    return res.data;
  },

  checkMemberByCpf: async (cpf: string): Promise<MemberLookupDto> => {
    const res = await api.get<MemberLookupDto>('/admin/orders/member-check', { params: { cpf } });
    return res.data;
  },

  startNegotiating: async (orderCode: string): Promise<AdminOrderDto> => {
    const cleanCode = orderCode.replace('#', '');
    const res = await api.post<AdminOrderDto>(`/admin/orders/${cleanCode}/negotiate`);
    return res.data;
  },

  updateOrderItems: async (
    orderCode: string,
    payload: {
      items: Array<{ variantId: string; quantity: number }>;
      discountAmount?: number;
      notes?: string;
    },
  ): Promise<AdminOrderDto> => {
    const cleanCode = orderCode.replace('#', '');
    const res = await api.put<AdminOrderDto>(`/admin/orders/${cleanCode}`, payload);
    return res.data;
  },

  confirmOrder: async (
    orderCode: string,
    payload: { payments: Array<{ paymentMethod: string; amount: number }>; notes?: string },
  ): Promise<AdminOrderDto> => {
    const cleanCode = orderCode.replace('#', '');
    const res = await api.post<AdminOrderDto>(`/admin/orders/${cleanCode}/confirm`, payload);
    return res.data;
  },

  cancelAdminOrder: async (orderCode: string, reason?: string): Promise<AdminOrderDto> => {
    const cleanCode = orderCode.replace('#', '');
    const res = await api.post<AdminOrderDto>(`/admin/orders/${cleanCode}/cancel`, { reason });
    return res.data;
  },

  reactivateOrder: async (orderCode: string): Promise<AdminOrderDto> => {
    const cleanCode = orderCode.replace('#', '');
    const res = await api.post<AdminOrderDto>(`/admin/orders/${cleanCode}/reactivate`);
    return res.data;
  },

  createCounterSale: async (payload: {
    customerType?: string;
    customerCpf?: string;
    customerName?: string;
    discountAmount?: number;
    notes?: string;
    items: Array<{ variantId: string; quantity: number }>;
    payments: Array<{ paymentMethod: string; amount: number }>;
  }): Promise<AdminOrderDto> => {
    const res = await api.post<AdminOrderDto>('/admin/orders/counter-sale', payload);
    return res.data;
  },
};
