import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(persist((set, get) => ({
  items: [], // { id, name, price, quantity }

  addItem: (item) => {
    const exists = get().items.find((i) => i.id === item.id);
    if (exists) return; // Prevent duplicates
    set({ items: [...get().items, { ...item, quantity: item.quantity ?? 1 }] });
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) return;
    set({ items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)) });
  },

  removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
  clear: () => set({ items: [] }),

  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}), { name: 'cart' }));
