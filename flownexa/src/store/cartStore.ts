import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Cart, CartItem } from "@/types/cart";
import { Product } from "@/types/product";

interface CartStore {
  cart: Cart;
  addItem: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  applyDiscount: (code: string) => boolean;
}

const calculateTotals = (items: CartItem[], currentDiscount = 0): Omit<Cart, "items"> => {
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 9.99;
  const discountAmount = subtotal * currentDiscount;
  const total = Math.max(0, subtotal + shipping - discountAmount);

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    discount: parseFloat(discountAmount.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: {
        items: [],
        subtotal: 0,
        shipping: 0,
        discount: 0,
        total: 0,
      },
      addItem: (product, quantity = 1, color, size) => {
        const { items } = get().cart;
        const existingItemIndex = items.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.selectedColor === color &&
            item.selectedSize === size
        );

        const newItems = [...items];

        if (existingItemIndex > -1) {
          newItems[existingItemIndex].quantity += quantity;
        } else {
          newItems.push({ product, quantity, selectedColor: color, selectedSize: size });
        }

        // Keep discount percentage (mock simple code tracker)
        const discountRate = get().cart.discount > 0 ? get().cart.discount / (get().cart.subtotal || 1) : 0;
        const totals = calculateTotals(newItems, discountRate);

        set({
          cart: {
            items: newItems,
            ...totals,
          },
        });
      },
      removeItem: (productId, color, size) => {
        const { items } = get().cart;
        const newItems = items.filter(
          (item) =>
            !(
              item.product.id === productId &&
              item.selectedColor === color &&
              item.selectedSize === size
            )
        );

        const discountRate = get().cart.discount > 0 ? get().cart.discount / (get().cart.subtotal || 1) : 0;
        const totals = calculateTotals(newItems, discountRate);

        set({
          cart: {
            items: newItems,
            ...totals,
          },
        });
      },
      updateQuantity: (productId, quantity, color, size) => {
        if (quantity <= 0) {
          get().removeItem(productId, color, size);
          return;
        }

        const { items } = get().cart;
        const newItems = items.map((item) => {
          if (
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          ) {
            return { ...item, quantity };
          }
          return item;
        });

        const discountRate = get().cart.discount > 0 ? get().cart.discount / (get().cart.subtotal || 1) : 0;
        const totals = calculateTotals(newItems, discountRate);

        set({
          cart: {
            items: newItems,
            ...totals,
          },
        });
      },
      clearCart: () => {
        set({
          cart: {
            items: [],
            subtotal: 0,
            shipping: 0,
            discount: 0,
            total: 0,
          },
        });
      },
      applyDiscount: (code) => {
        const uppercaseCode = code.toUpperCase();
        let discountRate = 0;

        if (uppercaseCode === "FLOWNEXA10") {
          discountRate = 0.1; // 10% off
        } else if (uppercaseCode === "WELCOME20") {
          discountRate = 0.2; // 20% off
        } else {
          return false;
        }

        const { items } = get().cart;
        const totals = calculateTotals(items, discountRate);

        set({
          cart: {
            items,
            ...totals,
          },
        });

        return true;
      },
    }),
    {
      name: "flownexa-cart-storage",
    }
  )
);
