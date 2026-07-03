"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Trash2, ArrowLeft, ArrowRight, ShoppingCart, Tag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import QuantityStepper from "@/components/shared/QuantityStepper";
import PriceDisplay from "@/components/shared/PriceDisplay";
import SectionHeader from "@/components/shared/SectionHeader";
import PageTransition from "@/components/shared/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  promoCode: z.string().min(1, "Please enter a code"),
});

type FormData = z.infer<typeof schema>;

export default function CartPage() {
  const { cart, updateQuantity, removeItem, applyDiscount } = useCartStore();
  const [isApplying, setIsApplying] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onPromoSubmit = async (data: FormData) => {
    setIsApplying(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsApplying(false);

    const success = applyDiscount(data.promoCode);
    if (success) {
      toast.success(`Discount code "${data.promoCode.toUpperCase()}" applied!`);
      reset();
    } else {
      toast.error("Invalid coupon code.", {
        description: "Try codes: FLOWNEXA10 or WELCOME20",
      });
    }
  };

  const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <PageTransition>
      <div className="bg-flownexa-black text-white min-h-screen py-10 font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          
          <SectionHeader
            title="Shopping Cart"
            subtitle="Review your selections and apply coupon codes before proceeding to payment."
            badge="Checkout Queue"
          />

          {cart.items.length === 0 ? (
            <div className="bg-zinc-900 border border-white/5 rounded-3xl py-20 px-6 text-center flex flex-col items-center justify-center max-w-xl mx-auto">
              <div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mb-4">
                <ShoppingCart size={26} />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Your shopping cart is empty</h3>
              <p className="text-sm text-muted-foreground max-w-xs mb-6">
                You haven&apos;t added any items to your shopping cart yet. Discover our releases to get started.
              </p>
              <Link href="/products">
                <Button className="rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover shadow-lg shadow-flownexa-lime/10 px-6 py-5">
                  Browse Catalog
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
              
              {/* Cart Items List (Left 8 Columns) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 flex flex-col gap-4 divide-y divide-white/5">
                  {cart.items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedColor || ""}-${item.selectedSize || ""}`}
                      className={`flex flex-col sm:flex-row sm:items-center gap-4 py-4 first:pt-0 last:pb-0`}
                    >
                      {/* Product Thumbnail */}
                      <div className="size-24 rounded-2xl bg-white/3 border border-white/5 overflow-hidden shrink-0 flex items-center justify-center p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
                        />
                      </div>

                      {/* Product Title / Variant info */}
                      <div className="flex-1 flex flex-col min-w-0">
                        <Link href={`/products/${item.product.slug}`} className="hover:text-flownexa-lime transition-colors">
                          <h3 className="font-semibold text-base text-white truncate">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted-foreground capitalize mt-0.5">{item.product.category}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.selectedColor && (
                            <span className="text-[10px] bg-white/5 px-2.5 py-0.5 rounded-full text-muted-foreground flex items-center gap-1.5 border border-white/5">
                              Color: 
                              <span
                                className="size-2.5 rounded-full inline-block"
                                style={{ backgroundColor: item.selectedColor }}
                              />
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="text-[10px] bg-white/5 px-2.5 py-0.5 rounded-full text-muted-foreground border border-white/5">
                              Size: {item.selectedSize}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stepper, Price & Remove Action */}
                      <div className="flex sm:flex-row items-center justify-between gap-6 mt-3 sm:mt-0 shrink-0">
                        <QuantityStepper
                          quantity={item.quantity}
                          onIncrease={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                          onDecrease={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                          className="bg-flownexa-black border-white/10"
                        />
                        <div className="flex items-center gap-4">
                          <PriceDisplay price={item.product.price * item.quantity} size="md" className="min-w-16 text-right" />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedSize)}
                            className="size-9 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-400 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-white transition-colors self-start group pl-2"
                >
                  <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
                  Continue Shopping
                </Link>
              </div>

              {/* Order Summary Sticky Panel (Right 4 Columns) */}
              <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
                
                {/* Summary Card */}
                <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 text-white flex flex-col gap-5">
                  <h3 className="font-heading font-bold text-base border-b border-white/5 pb-4">
                    Order Summary
                  </h3>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>₹{cart.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Shipping</span>
                      <span>{cart.shipping === 0 ? "FREE" : `₹${cart.shipping.toFixed(2)}`}</span>
                    </div>
                    {cart.discount > 0 && (
                      <div className="flex justify-between text-sm text-flownexa-lime">
                        <span>Coupon Discount</span>
                        <span>-₹{cart.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg text-white border-t border-white/5 pt-4 mt-2">
                      <span>Total Amount</span>
                      <span>₹{cart.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link href="/checkout" className="w-full mt-2">
                    <Button className="w-full gap-2.5 py-6 rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover shadow-lg shadow-flownexa-lime/10 text-sm">
                      Proceed to Checkout
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>

                {/* Promo Code Form */}
                <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 text-white">
                  <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Tag size={12} className="text-flownexa-lime" />
                    Promo Code
                  </h3>
                  
                  <form onSubmit={handleSubmit(onPromoSubmit)} className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Input
                        {...register("promoCode")}
                        placeholder="e.g., WELCOME20"
                        className="rounded-xl bg-flownexa-black border-white/10 text-white placeholder-muted-foreground text-xs focus-visible:ring-flownexa-lime/50 h-10 flex-1 px-4"
                      />
                      <Button
                        type="submit"
                        disabled={isApplying}
                        className="rounded-xl h-10 px-4 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10"
                      >
                        Apply
                      </Button>
                    </div>
                    {errors.promoCode && (
                      <span className="text-[10px] text-red-400 pl-2">{errors.promoCode.message}</span>
                    )}
                  </form>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
