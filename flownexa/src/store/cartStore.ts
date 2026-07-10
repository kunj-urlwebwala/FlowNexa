import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Cart, CartItem } from "@/types/cart";
import { Product } from "@/types/product";
import { api } from "@/lib/api";

interface CartStore {
  cart: Cart;
  addItem: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  applyDiscount: (code: string) => boolean;
  fetchCart: () => Promise<void>;
  syncCartAfterLogin: () => Promise<void>;
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

function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const storeData = localStorage.getItem("flownexa-auth-store");
  if (!storeData) return false;
  try {
    const parsed = JSON.parse(storeData);
    return !!parsed?.state?.token;
  } catch {
    return false;
  }
}

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

        const discountRate = get().cart.discount > 0 ? get().cart.discount / (get().cart.subtotal || 1) : 0;
        const totals = calculateTotals(newItems, discountRate);

        set({
          cart: {
            items: newItems,
            ...totals,
          },
        });

        // Sync to backend if authenticated
        if (isAuthenticated()) {
          api.post("/cart/items", {
            productId: product.id,
            variantId: null,
            quantity,
          }).catch(() => {});
        }
      },
      removeItem: (productId, color, size) => {
        const { items } = get().cart;
        const itemToRemove = items.find(
          (item) =>
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
        );
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

        // Sync to backend if authenticated
        if (isAuthenticated()) {
          api.get("/cart").then((cartData: any) => {
            const backendItem = cartData?.items?.find(
              (bi: any) => bi.productId === productId
            );
            if (backendItem?.id) {
              api.delete(`/cart/items/${backendItem.id}`).catch(() => {});
            }
          }).catch(() => {});
        }
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

        // Sync to backend if authenticated
        if (isAuthenticated()) {
          api.get("/cart").then((cartData: any) => {
            const backendItem = cartData?.items?.find(
              (bi: any) => bi.productId === productId
            );
            if (backendItem?.id) {
              api.patch(`/cart/items/${backendItem.id}`, { quantity }).catch(() => {});
            }
          }).catch(() => {});
        }
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

        // Sync to backend if authenticated
        if (isAuthenticated()) {
          api.delete("/cart").catch(() => {});
        }
      },
      applyDiscount: (code) => {
        const uppercaseCode = code.toUpperCase();
        let discountRate = 0;

        if (uppercaseCode === "FLOWNEXA10") {
          discountRate = 0.1;
        } else if (uppercaseCode === "WELCOME20") {
          discountRate = 0.2;
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
      fetchCart: async () => {
        if (!isAuthenticated()) return;
        try {
          const cartData: any = await api.get("/cart");
          if (cartData?.items?.length > 0) {
            // Convert backend cart items to local format
            const localItems: CartItem[] = await Promise.all(
              cartData.items.map(async (item: any) => {
                let product: Product;
                if (item.product) {
                  product = {
                    id: item.product.id,
                    name: item.product.name,
                    slug: item.product.slug,
                    price: item.currentPrice || item.product.price,
                    originalPrice: item.product.compareAtPrice,
                    images: item.product.images || [],
                    category: "",
                    rating: 0,
                    reviewCount: 0,
                    inStock: item.inStock !== false,
                    description: "",
                    specifications: {},
                  };
                } else {
                  const prodData: any = await api.get(`/products/${item.productId}`).catch(() => null);
                  product = prodData || {
                    id: item.productId,
                    name: item.productName || "Product",
                    slug: "",
                    price: item.currentPrice || 0,
                    images: [],
                    category: "",
                    rating: 0,
                    reviewCount: 0,
                    inStock: true,
                    description: "",
                    specifications: {},
                  };
                }
                return {
                  product,
                  quantity: item.quantity,
                };
              })
            );
            const totals = calculateTotals(localItems, 0);
            set({ cart: { items: localItems, ...totals } });
          }
        } catch {
          // Silently fail - keep local cart
        }
      },
      syncCartAfterLogin: async () => {
        const { items } = get().cart;
        if (items.length === 0) {
          // No local items, just fetch backend cart
          await get().fetchCart();
          return;
        }

        // Push local items to backend
        try {
          for (const item of items) {
            await api.post("/cart/items", {
              productId: item.product.id,
              variantId: null,
              quantity: item.quantity,
            }).catch(() => {});
          }
          // Then fetch the merged cart from backend
          await get().fetchCart();
        } catch {
          // Keep local cart as fallback
        }
      },
    }),
    {
      name: "flownexa-cart-storage",
    }
  )
);
