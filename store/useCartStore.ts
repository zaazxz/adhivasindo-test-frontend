import { create } from 'zustand';
import { CartItem, Product } from '@/types';
import Cookies from 'js-cookie';

// NOTE: Cart is stored in cookies for dummy/demo purposes only.
// In production, use a proper backend cart API or database persistence.

const CART_COOKIE_KEY = 'cart_items';

const loadCartFromCookies = (): CartItem[] => {
  try {
    const raw = Cookies.get(CART_COOKIE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore parse errors
  }
  return [];
};

const saveCartToCookies = (items: CartItem[]) => {
  try {
    Cookies.set(CART_COOKIE_KEY, JSON.stringify(items), { expires: 7 }); // 7 days
  } catch {
    // Ignore storage errors
  }
};

interface CartState {
  isOpen: boolean;
  items: CartItem[];
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  isOpen: false,
  items: loadCartFromCookies(), // Load from cookies on init (for dummy only)
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  setCartOpen: (open) => set({ isOpen: open }),
  
  addItem: (product, quantity = 1) => set((state) => {
    const existingItem = state.items.find((item) => item.id === product.id);
    let newItems: CartItem[];
    if (existingItem) {
      newItems = state.items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      newItems = [...state.items, { ...product, quantity }];
    }
    saveCartToCookies(newItems); // Persist to cookies (for dummy only)
    return { items: newItems };
  }),
  
  removeItem: (productId) => set((state) => {
    const newItems = state.items.filter((item) => item.id !== productId);
    saveCartToCookies(newItems);
    return { items: newItems };
  }),
  
  updateQuantity: (productId, quantity) => set((state) => {
    const newItems = state.items.map((item) =>
      item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    saveCartToCookies(newItems);
    return { items: newItems };
  }),

  clearCart: () => {
    Cookies.remove(CART_COOKIE_KEY);
    set({ items: [] });
  },
  
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
  },
  
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));
