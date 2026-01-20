import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  variants: Record<string, string>; // e.g., { "Talle": "16", "Material": "Oro" }
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed values
  itemCount: () => number;
  subtotal: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const { items } = get();
        const quantity = newItem.quantity || 1;

        // Check if item with same productId and variants already exists
        const existingItemIndex = items.findIndex(
          (item) =>
            item.productId === newItem.productId &&
            JSON.stringify(item.variants) === JSON.stringify(newItem.variants)
        );

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          const existingItem = items[existingItemIndex];
          const newQuantity = Math.min(
            existingItem.quantity + quantity,
            existingItem.maxStock
          );

          set({
            items: items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
        } else {
          // Add new item
          const cartItem: CartItem = {
            id: `${newItem.productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...newItem,
            quantity,
          };

          set({ items: [...items, cartItem] });
        }
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.min(quantity, item.maxStock) }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      // Computed values
      itemCount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      subtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      totalItems: () => {
        const { items } = get();
        return items.length;
      },
    }),
    {
      name: 'moksha-cart-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist items, not UI state
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

// Selectors for better performance
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartItemCount = () => useCartStore((state) => state.itemCount());
export const useCartSubtotal = () => useCartStore((state) => state.subtotal());
export const useCartIsOpen = () => useCartStore((state) => state.isOpen);

// Individual action hooks to avoid object creation on every render
export const useCartAddItem = () => useCartStore((state) => state.addItem);
export const useCartRemoveItem = () => useCartStore((state) => state.removeItem);
export const useCartUpdateQuantity = () => useCartStore((state) => state.updateQuantity);
export const useCartClearCart = () => useCartStore((state) => state.clearCart);
export const useCartOpenCart = () => useCartStore((state) => state.openCart);
export const useCartCloseCart = () => useCartStore((state) => state.closeCart);
export const useCartToggleCart = () => useCartStore((state) => state.toggleCart);