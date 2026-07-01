"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUIStore } from "@/store/uiStore";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuantityStepper from "@/components/shared/QuantityStepper";
import PriceDisplay from "@/components/shared/PriceDisplay";

export default function CartDrawer() {
  const { isCartOpen, setCartOpen } = useUIStore();
  const { cart, updateQuantity, removeItem } = useCartStore();

  const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md bg-flownexa-black text-white border-l border-white/10 flex flex-col p-6 font-sans">
        <SheetHeader className="pb-4 border-b border-white/10">
          <SheetTitle className="text-left text-white font-heading font-bold text-xl flex items-center gap-2.5">
            <ShoppingCart size={20} className="text-flownexa-lime" />
            Shopping Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mb-4">
              <ShoppingCart size={28} />
            </div>
            <h3 className="font-semibold text-lg text-white mb-2">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground max-w-[240px] mb-6">
              Looks like you haven&apos;t added any products to your cart yet.
            </p>
            <Button
              onClick={() => setCartOpen(false)}
              className="rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 divide-y divide-white/10 pr-1 scrollbar-thin">
              {cart.items.map((item) => (
                <div key={`${item.product.id}-${item.selectedColor || ""}-${item.selectedSize || ""}`} className="py-4 flex gap-4 first:pt-0">
                  <div className="size-20 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="size-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-medium text-sm text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.selectedColor && (
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-muted-foreground flex items-center gap-1">
                              Color: 
                              <span
                                className="size-2 rounded-full inline-block"
                                style={{ backgroundColor: item.selectedColor }}
                              />
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-muted-foreground">
                              Size: {item.selectedSize}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedSize)}
                        className="size-7 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-400"
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>

                    <div className="flex justify-between items-center mt-auto pt-2">
                      <QuantityStepper
                        quantity={item.quantity}
                        onIncrease={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                        onDecrease={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                        className="bg-white/5 border-white/10"
                      />
                      <PriceDisplay price={item.product.price * item.quantity} size="sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary Footer */}
            <div className="pt-4 border-t border-white/10 mt-auto flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>{cart.shipping === 0 ? "FREE" : `$${cart.shipping.toFixed(2)}`}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-sm text-flownexa-lime">
                    <span>Discount</span>
                    <span>-${cart.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg text-white pt-2 border-t border-white/5 mt-2">
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 mt-2">
                <Link href="/checkout" onClick={() => setCartOpen(false)} className="w-full">
                  <Button className="w-full gap-2 py-5 rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover shadow-lg shadow-flownexa-lime/10">
                    Proceed to Checkout
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link href="/cart" onClick={() => setCartOpen(false)} className="w-full text-center">
                  <span className="text-xs text-muted-foreground hover:text-white transition-colors underline underline-offset-4 cursor-pointer block py-1.5">
                    View Full Cart
                  </span>
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
