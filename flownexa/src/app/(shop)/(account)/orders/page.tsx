"use client";

import Link from "next/link";
import { History, Eye, CheckCircle2, Truck, AlertCircle, ShoppingBag, MapPin, Receipt, ShieldCheck } from "lucide-react";
import PriceDisplay from "@/components/shared/PriceDisplay";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function OrdersPage() {
  const { user } = useAuthStore();
  const defaultAddress = user?.addresses?.find((addr) => addr.isDefault) || user?.addresses?.[0] || {
    fullName: "Alex Mercer",
    phone: "+1 (555) 019-2834",
    addressLine1: "128 Innovation Way",
    addressLine2: "Suite 400",
    city: "San Francisco",
    state: "CA",
    zipCode: "94107",
    country: "United States",
  };

  // Mock Order history data
  const mockOrders = [
    {
      id: "FN-847291",
      createdAt: "June 25, 2026",
      status: "delivered",
      paymentMethod: "Credit Card",
      shippingMethod: "Express Shipping",
      subtotal: 299.0,
      shipping: 0,
      total: 299.0,
      items: [
        {
          product: products[0], // Sequoia Headphones
          quantity: 1,
        },
      ],
    },
    {
      id: "FN-726481",
      createdAt: "May 12, 2026",
      status: "shipped",
      paymentMethod: "Cash on Delivery",
      shippingMethod: "Standard Shipping",
      subtotal: 208.0,
      shipping: 0,
      total: 208.0,
      items: [
        {
          product: products[2], // X-Buds Pro
          quantity: 1,
        },
        {
          product: products[6], // Power bank
          quantity: 1,
        },
      ],
    },
  ];

  const statusIcons = {
    delivered: { icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", label: "Delivered" },
    shipped: { icon: Truck, color: "text-blue-400 bg-blue-500/10 border-blue-500/25", label: "Shipped" },
    pending: { icon: AlertCircle, color: "text-amber-400 bg-amber-500/10 border-amber-500/25", label: "Pending" },
    processing: { icon: AlertCircle, color: "text-purple-400 bg-purple-500/10 border-purple-500/25", label: "Processing" },
    cancelled: { icon: AlertCircle, color: "text-red-400 bg-red-500/10 border-red-500/25", label: "Cancelled" },
  };

  return (
    <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-8 text-white font-sans flex flex-col gap-6">
      <h2 className="text-lg font-bold font-heading border-b border-white/5 pb-4 mb-2">
        Order History
      </h2>

      {mockOrders.length > 0 ? (
        <div className="flex flex-col gap-6">
          {mockOrders.map((order) => {
            const status = statusIcons[order.status as keyof typeof statusIcons];
            const StatusIcon = status.icon;
            
            return (
              <div
                key={order.id}
                className="bg-flownexa-black border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row gap-5 justify-between items-start md:items-center"
              >
                
                {/* Left Side: Order Meta */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-sm text-white">{order.id}</span>
                    <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
                      <StatusIcon size={12} />
                      {status.label}
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Placed on <strong className="text-white font-medium">{order.createdAt}</strong>
                  </div>

                  {/* Thumbnail Row */}
                  <div className="flex items-center gap-2 mt-1">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="size-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-1 relative"
                        title={item.product.name}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.product.images[0]} alt="" className="max-h-full max-w-full object-contain" />
                        {item.quantity > 1 && (
                          <span className="absolute -bottom-1 -right-1 bg-flownexa-lime text-flownexa-black font-extrabold text-[9px] size-4 rounded-full flex items-center justify-center border border-flownexa-black">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Order Action & Pricing */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-white/5 shrink-0">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Total Amount</p>
                    <PriceDisplay price={order.total} size="sm" className="mt-1" />
                  </div>
                  
                  {/* View Details modal using shadcn dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="xs"
                        className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 gap-1.5 font-semibold text-xs px-3 py-4 cursor-pointer"
                      >
                        <Eye size={12} />
                        View Details
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="bg-zinc-950 border border-white/10 text-white rounded-2xl max-w-xl font-sans p-6">
                      <DialogHeader className="pb-4 border-b border-white/5">
                        <DialogTitle className="text-white text-left font-bold font-heading text-lg flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Receipt size={18} className="text-flownexa-lime" />
                            Order Details ({order.id})
                          </span>
                          <span className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full border ${status.color}`}>
                            {status.label}
                          </span>
                        </DialogTitle>
                      </DialogHeader>

                      <div className="flex flex-col gap-5 py-4 overflow-y-auto max-h-[70vh] pr-1 scrollbar-thin">
                        {/* Items list */}
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                            Items Ordered
                          </p>
                          <div className="flex flex-col gap-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-3 items-center justify-between bg-white/3 border border-white/5 p-3 rounded-xl">
                                <div className="flex gap-3 items-center">
                                  <div className="size-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-1 shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={item.product.images[0]} alt="" className="max-h-full max-w-full object-contain" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-xs text-white line-clamp-1">{item.product.name}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">Qty: {item.quantity} | Price: ${item.product.price}</p>
                                  </div>
                                </div>
                                <span className="font-semibold text-xs text-white shrink-0">
                                  ${(item.product.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator className="bg-white/5" />

                        {/* Split Shipping & Payment */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          
                          {/* Shipping address details */}
                          <div className="flex flex-col gap-2">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                              Shipping Address
                            </p>
                            <div className="flex gap-2 items-start text-xs text-muted-foreground leading-relaxed">
                              <MapPin size={14} className="text-flownexa-lime shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold text-white">{defaultAddress.fullName}</p>
                                <p>{defaultAddress.addressLine1}</p>
                                {defaultAddress.addressLine2 && <p>{defaultAddress.addressLine2}</p>}
                                <p>{defaultAddress.city}, {defaultAddress.state} {defaultAddress.zipCode}</p>
                                <p>{defaultAddress.country}</p>
                                <p className="mt-1 font-semibold text-white">Phone: {defaultAddress.phone}</p>
                              </div>
                            </div>
                          </div>

                          {/* Payment details */}
                          <div className="flex flex-col gap-2">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                              Payment & Delivery
                            </p>
                            <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                              <div>
                                <span className="font-semibold text-white block">Payment Mode:</span>
                                <span>{order.paymentMethod}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-white block">Delivery Mode:</span>
                                <span>{order.shippingMethod}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-white block">Placed Date:</span>
                                <span>{order.createdAt}</span>
                              </div>
                            </div>
                          </div>

                        </div>

                        <Separator className="bg-white/5" />

                        {/* Final summary list */}
                        <div className="flex flex-col gap-2.5">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Subtotal</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Shipping</span>
                            <span>{order.shipping === 0 ? "FREE" : `$${order.shipping.toFixed(2)}`}</span>
                          </div>
                          <div className="flex justify-between font-bold text-sm text-white pt-2.5 border-t border-white/5">
                            <span>Grand Total</span>
                            <span className="text-flownexa-lime">${order.total.toFixed(2)}</span>
                          </div>
                        </div>

                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-white/5 bg-flownexa-black p-10 rounded-2xl text-center flex flex-col items-center">
          <History size={24} className="text-muted-foreground mb-2" />
          <p className="text-sm font-semibold text-white">No orders found</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
            You haven&apos;t placed any orders on FlowNexa yet.
          </p>
          <Link href="/products" className="mt-4">
            <Button className="rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover gap-1.5">
              <ShoppingBag size={14} />
              Shop Now
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
