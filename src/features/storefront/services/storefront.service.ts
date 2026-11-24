import { api } from '@/services/api';

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
  totalAvailableStock: number;
  variants: PublicVariant[];
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
};
