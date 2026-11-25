import { api } from '@/services/api';
import { StoreUser } from '@/store/useAuthStore';

export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
}

export interface PublicVariant {
  id: string;
  sku: string;
  sizeLabel: string;
  colorLabel?: string;
  salePrice: number;
  memberPrice?: number | null;
  availableStock: number;
  active: boolean;
}

export interface PublicProduct {
  id: string;
  categoryId?: string;
  categoryName?: string;
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  coverImageUrl?: string | null;
  galleryUrls?: string[];
  totalAvailableStock: number;
  variants: PublicVariant[];
}

export interface StorePublicConfig {
  storeName: string;
  whatsappNumber: string;
  openHour: string;
  closeHour: string;
  workingDays: string;
  reservationTtlMinutes: number;
}

export interface CustomerOrderItem {
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

export interface CustomerOrder {
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
  items: CustomerOrderItem[];
}

export const storefrontService = {
  getCategories: async (): Promise<PublicCategory[]> => {
    const res = await api.get<PublicCategory[]>('/public/categories');
    return res.data;
  },

  getProducts: async (categoryId?: string, search?: string): Promise<PublicProduct[]> => {
    const res = await api.get<{ data: PublicProduct[] }>('/public/products', {
      params: { categoryId: categoryId || undefined, search: search || undefined, limit: 24 },
    });
    return res.data.data || [];
  },

  getProductBySlug: async (slug: string): Promise<PublicProduct> => {
    const res = await api.get<PublicProduct>(`/public/products/${slug}`);
    return res.data;
  },

  getStoreConfig: async (): Promise<StorePublicConfig> => {
    const res = await api.get<StorePublicConfig>('/public/store-config');
    return res.data;
  },

  loginCustomer: async (cpf: string, password: string): Promise<{ accessToken: string; user: StoreUser }> => {
    const res = await api.post<{ accessToken: string; user: StoreUser }>('/auth/login', { cpf, password });
    return res.data;
  },

  exchangeSsoToken: async (token: string): Promise<{ accessToken: string; user: StoreUser }> => {
    const res = await api.post<{ accessToken: string; user: StoreUser }>('/auth/sso', { token });
    return res.data;
  },

  logoutCustomer: async () => {
    await api.post('/auth/logout').catch(() => {});
  },

  createWhatsappReservation: async (payload: {
    customerWhatsapp: string;
    notes?: string;
    items: Array<{ variantId: string; quantity: number }>;
  }): Promise<CustomerOrder> => {
    const res = await api.post<CustomerOrder>('/orders/whatsapp-reservation', payload);
    return res.data;
  },

  listMyOrders: async (): Promise<CustomerOrder[]> => {
    const res = await api.get<CustomerOrder[]>('/orders/my');
    return res.data;
  },

  cancelMyOrder: async (orderCode: string, reason?: string): Promise<CustomerOrder> => {
    const cleanCode = orderCode.replace('#', '');
    const res = await api.post<CustomerOrder>(`/orders/my/${cleanCode}/cancel`, { reason });
    return res.data;
  },
};
