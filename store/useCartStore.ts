import { create } from 'zustand';
import { CartItem, Product } from '@/types';

interface CartState {
  isOpen: boolean;
  items: CartItem[];
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  isOpen: false,
  items: [
    { id: 1, name: "Growers cider", desc: "Brief description", price: 20000, quantity: 1, image: "" },
    { id: 2, name: "Fresh grapes", desc: "Brief description", price: 40000, quantity: 1, image: "" },
    { id: 3, name: "Heinz tomato ketchup", desc: "Brief description", price: 10000, quantity: 1, image: "" },
  ],
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  setCartOpen: (open) => set({ isOpen: open }),
  
  addItem: (product, quantity = 1) => set((state) => {
    const existingItem = state.items.find((item) => item.id === product.id);
    if (existingItem) {
      return {
        items: state.items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        ),
      };
    }
    return { items: [...state.items, { ...product, quantity }] };
  }),
  
  removeItem: (productId) => set((state) => ({
    items: state.items.filter((item) => item.id !== productId),
  })),
  
  updateQuantity: (productId, quantity) => set((state) => ({
    items: state.items.map((item) =>
      item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    ),
  })),
  
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));
