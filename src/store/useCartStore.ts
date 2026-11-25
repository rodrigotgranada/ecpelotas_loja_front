import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  variantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  sku: string;
  sizeLabel: string;
  colorLabel?: string;
  coverImageUrl?: string | null;
  salePrice: number;
  memberPrice?: number | null;
  availableStock: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity) =>
        set((state) => {
          const safeQty = Math.max(1, Math.min(quantity, item.availableStock));
          const existing = state.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? {
                      ...i,
                      availableStock: item.availableStock,
                      salePrice: item.salePrice,
                      memberPrice: item.memberPrice,
                      quantity: Math.min(i.quantity + safeQty, item.availableStock),
                    }
                  : i,
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: safeQty }],
          };
        }),
      updateQuantity: (variantId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.variantId !== variantId) };
          }
          return {
            items: state.items.map((i) =>
              i.variantId === variantId
                ? { ...i, quantity: Math.min(quantity, Math.max(1, i.availableStock)) }
                : i,
            ),
          };
        }),
      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'ecp-loja-cart',
    },
  ),
);
