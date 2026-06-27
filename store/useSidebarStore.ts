import { create } from 'zustand';
import { SidebarState } from '@/types';

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: typeof window !== 'undefined' ? window.innerWidth >= 768 : true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open: boolean) => set({ isOpen: open }),
}));
