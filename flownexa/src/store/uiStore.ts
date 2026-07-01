import { create } from "zustand";

interface UIStore {
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleCart: () => void;
  toggleSearch: () => void;
  toggleMobileMenu: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  isSearchOpen: false,
  isMobileMenuOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}));
