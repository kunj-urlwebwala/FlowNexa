"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ShieldCheck, ArrowLeft, ArrowRight, CreditCard, CheckCircle2, Ticket, MapPin } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import type { Address } from "@/types/user";
import Logo from "@/components/shared/Logo";
import { motion } from "framer-motion";
import PageTransition from "@/components/shared/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(10, "Please enter a valid phone number (min 10 digits)"),
  addressLine1: z.string().min(5, "Please enter your street address"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().min(2, "Please enter your state"),
  zipCode: z.string().min(4, "Please enter a valid ZIP/Postal code"),
  country: z.string().min(2, "Please enter your country"),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
});

type FormData = z.infer<typeof checkoutSchema>;

const MAX_ADDRESSES = 5;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const { user, isAuthenticated, addAddress } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to proceed to checkout");
      router.push("/login?redirect=/checkout");
    }
  }, [isAuthenticated, router]);

  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "new">("new");

  const savedAddresses = user?.addresses || [];
  const defaultAddress = savedAddresses.find((addr) => addr.isDefault) || savedAddresses[0];

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: defaultAddress?.fullName || user?.name || "",
      phone: defaultAddress?.phone || user?.phone || "",
      addressLine1: defaultAddress?.addressLine1 || "",
      addressLine2: defaultAddress?.addressLine2 || "",
      city: defaultAddress?.city || "",
      state: defaultAddress?.state || "",
      zipCode: defaultAddress?.zipCode || "",
      country: defaultAddress?.country || "United States",
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
    },
  });

  useEffect(() => {
    if (defaultAddress && selectedAddressId === "new") {
      setSelectedAddressId(defaultAddress.id);
    }
  }, []);

  const handleAddressSelect = (addrId: string) => {
    setSelectedAddressId(addrId);
    if (addrId !== "new") {
      const addr = savedAddresses.find((a) => a.id === addrId);
      if (addr) {
        setValue("fullName", addr.fullName);
        setValue("phone", addr.phone);
        setValue("addressLine1", addr.addressLine1);
        setValue("addressLine2", addr.addressLine2 || "");
        setValue("city", addr.city);
        setValue("state", addr.state);
        setValue("zipCode", addr.zipCode);
        setValue("country", addr.country);
      }
    } else {
      setValue("fullName", user?.name || "");
      setValue("phone", user?.phone || "");
      setValue("addressLine1", "");
      setValue("addressLine2", "");
      setValue("city", "");
      setValue("state", "");
      setValue("zipCode", "");
      setValue("country", "United States");
    }
  };

  const handleNextStep = async () => {
    const fieldsToValidate = [
      "fullName",
      "phone",
      "addressLine1",
      "city",
      "state",
      "zipCode",
      "country",
    ] as const;
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setStep("payment");
    }
  };

  const onSubmit = async (data: FormData) => {
    if (paymentMethod === "card") {
      if (!data.cardNumber || !/^\d{16}$/.test(data.cardNumber)) {
        toast.error("Card number must be exactly 16 digits.");
        return;
      }
      if (!data.cardExpiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.cardExpiry)) {
        toast.error("Expiry must be in MM/YY format.");
        return;
      }
      if (!data.cardCvv || !/^\d{3}$/.test(data.cardCvv)) {
        toast.error("CVV must be exactly 3 digits.");
        return;
      }
    }

    try {
      setIsSubmittingOrder(true);
      const orderItems = cart.items.map((item) => ({
        productId: item.product.id,
        variantId: null,
        productName: item.product.name,
        sku: `SKU-${item.product.name.replace(/\s+/g, '-').toUpperCase()}`,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const shippingAddress = {
        fullName: data.fullName,
        phone: data.phone.replace(/[^0-9]/g, "").slice(0, 15),
        street: data.addressLine1 + (data.addressLine2 ? `, ${data.addressLine2}` : ""),
        city: data.city,
        state: data.state,
        postalCode: data.zipCode,
        country: data.country || "India",
      };

      const payload = {
        shippingAddress,
        billingAddress: shippingAddress,
        subtotal: cart.subtotal,
        tax: 0,
        shippingCharges: cart.shipping,
        discount: cart.discount,
        total: cart.total,
        paymentMethod: paymentMethod === "card" ? "CARD" : "COD",
        items: orderItems,
      };

      await api.post("/orders", payload);

      if (selectedAddressId === "new" && savedAddresses.length < MAX_ADDRESSES) {
        addAddress({
          fullName: data.fullName,
          phone: data.phone,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2 || "",
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          isDefault: savedAddresses.length === 0,
        });
      }

      toast.success("Order Placed Successfully! Thank you for choosing FlowNexa.");
      setStep("success");
      clearCart();
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  if (cart.items.length === 0 && step !== "success") {
    return (
      <div className="bg-flownexa-black text-white min-h-screen flex flex-col items-center justify-center text-center p-6 font-sans">
        <h2 className="text-xl font-bold font-heading mb-2">Checkout Unavailable</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Your shopping cart is empty. You need items in your cart to checkout.
        </p>
        <Link href="/products">
          <Button className="rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover">
            Return to Shop
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="bg-flownexa-black text-white min-h-screen font-sans flex flex-col">

        <header className="border-b border-white/5 py-4 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck size={16} className="text-flownexa-lime" />
              <span>Secure 256-Bit SSL Checkout</span>
            </div>
          </div>
        </header>

        {step === "success" ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 max-w-xl mx-auto py-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="size-16 rounded-full bg-flownexa-lime-muted border border-flownexa-lime/30 flex items-center justify-center text-flownexa-lime mb-6"
            >
              <CheckCircle2 size={32} />
            </motion.div>

            <h1 className="text-3xl font-extrabold font-heading text-white mb-3">
              Order Confirmed!
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-sm">
              Your order has been placed successfully. We are preparing it for shipment and have sent a receipt to your email address.
            </p>

            <div className="w-full bg-zinc-900 border border-white/5 p-5 rounded-2xl flex justify-between text-left text-xs mb-8 divide-x divide-white/5">
              <div className="flex-1 pr-4">
                <p className="text-muted-foreground">Order ID</p>
                <p className="font-bold text-white mt-1">#FN-{Math.floor(100000 + Math.random() * 900000)}</p>
              </div>
              <div className="flex-1 pl-6">
                <p className="text-muted-foreground">Shipment Date</p>
                <p className="font-bold text-white mt-1">Tomorrow, 10:00 AM</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
              <Link href="/products" className="flex-1">
                <Button className="w-full rounded-full h-12 bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover shadow-lg shadow-flownexa-lime/10">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/orders" className="flex-1">
                <Button variant="outline" className="w-full rounded-full h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold">
                  Order History
                </Button>
              </Link>
            </div>
            <Link href="/" className="text-xs text-muted-foreground hover:text-white transition-colors underline underline-offset-4 mt-6">
              Return to Homepage
            </Link>
          </div>
        ) : (
          <div className="flex-1 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full py-10">

            <div className="flex items-center gap-3 mb-10 max-w-md text-xs font-semibold uppercase tracking-wider">
              <span className={step === "shipping" ? "text-flownexa-lime" : "text-muted-foreground"}>
                01 Shipping
              </span>
              <div className="h-px w-8 bg-white/10" />
              <span className={step === "payment" ? "text-flownexa-lime" : "text-muted-foreground"}>
                02 Payment
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

              <div className="lg:col-span-8">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

                  {step === "shipping" && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col gap-5"
                    >
                      <h2 className="text-lg font-bold font-heading border-b border-white/5 pb-4">
                        Shipping Address
                      </h2>

                      {savedAddresses.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <p className="text-xs text-muted-foreground font-semibold">Saved Addresses</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {savedAddresses.map((addr) => (
                              <button
                                type="button"
                                key={addr.id}
                                onClick={() => handleAddressSelect(addr.id)}
                                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                                  selectedAddressId === addr.id
                                    ? "border-flownexa-lime bg-white/3"
                                    : "border-white/5 hover:border-white/10 bg-flownexa-black"
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <MapPin size={14} className="text-flownexa-lime shrink-0 mt-0.5" />
                                  <div className="text-xs leading-relaxed">
                                    <p className="font-semibold text-white">{addr.fullName}</p>
                                    <p className="text-muted-foreground">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}</p>
                                    <p className="text-muted-foreground">{addr.city}, {addr.state} {addr.zipCode}</p>
                                    <p className="text-muted-foreground">{addr.country}</p>
                                    <p className="text-muted-foreground">{addr.phone}</p>
                                    {addr.isDefault && <span className="text-flownexa-lime text-[10px] font-semibold mt-1 block">Default</span>}
                                  </div>
                                </div>
                              </button>
                            ))}
                            {savedAddresses.length < MAX_ADDRESSES && (
                              <button
                                type="button"
                                onClick={() => handleAddressSelect("new")}
                                className={`text-left p-4 rounded-2xl border border-dashed transition-all cursor-pointer flex items-center justify-center min-h-[120px] ${
                                  selectedAddressId === "new"
                                    ? "border-flownexa-lime bg-white/3"
                                    : "border-white/10 hover:border-white/30 bg-flownexa-black"
                                }`}
                              >
                                <span className="text-xs text-muted-foreground font-semibold">+ New Address</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedAddressId === "new" && (
                        <div className="flex flex-col gap-4 pt-2 border-t border-white/5">
                          <p className="text-xs text-muted-foreground font-semibold">Enter New Address</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                              <Label htmlFor="fullName" className="text-xs font-semibold">Full Name</Label>
                              <Input {...register("fullName")} id="fullName" className="rounded-xl bg-flownexa-black border-white/10 h-11" />
                              {errors.fullName && <span className="text-xs text-red-400">{errors.fullName.message}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label htmlFor="phone" className="text-xs font-semibold">Phone Number</Label>
                              <Input {...register("phone")} id="phone" className="rounded-xl bg-flownexa-black border-white/10 h-11" />
                              {errors.phone && <span className="text-xs text-red-400">{errors.phone.message}</span>}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Label htmlFor="addressLine1" className="text-xs font-semibold">Street Address</Label>
                            <Input {...register("addressLine1")} id="addressLine1" placeholder="House number and street name" className="rounded-xl bg-flownexa-black border-white/10 h-11" />
                            {errors.addressLine1 && <span className="text-xs text-red-400">{errors.addressLine1.message}</span>}
                          </div>

                          <div className="flex flex-col gap-2">
                            <Label htmlFor="addressLine2" className="text-xs font-semibold">Apartment, Suite, Unit (Optional)</Label>
                            <Input {...register("addressLine2")} id="addressLine2" className="rounded-xl bg-flownexa-black border-white/10 h-11" />
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                              <Label htmlFor="city" className="text-xs font-semibold">City</Label>
                              <Input {...register("city")} id="city" className="rounded-xl bg-flownexa-black border-white/10 h-11" />
                              {errors.city && <span className="text-xs text-red-400">{errors.city.message}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label htmlFor="state" className="text-xs font-semibold">State / Region</Label>
                              <Input {...register("state")} id="state" className="rounded-xl bg-flownexa-black border-white/10 h-11" />
                              {errors.state && <span className="text-xs text-red-400">{errors.state.message}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label htmlFor="zipCode" className="text-xs font-semibold">ZIP / Postal Code</Label>
                              <Input {...register("zipCode")} id="zipCode" className="rounded-xl bg-flownexa-black border-white/10 h-11" />
                              {errors.zipCode && <span className="text-xs text-red-400">{errors.zipCode.message}</span>}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Label htmlFor="country" className="text-xs font-semibold">Country</Label>
                            <Input {...register("country")} id="country" className="rounded-xl bg-flownexa-black border-white/10 h-11" />
                            {errors.country && <span className="text-xs text-red-400">{errors.country.message}</span>}
                          </div>
                        </div>
                      )}

                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="rounded-full h-12 bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover gap-2 mt-4 ml-auto w-full sm:w-[180px]"
                      >
                        Continue to Payment
                        <ArrowRight size={16} />
                      </Button>
                    </motion.div>
                  )}

                  {step === "payment" && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col gap-6"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h2 className="text-lg font-bold font-heading">
                          Select Payment Method
                        </h2>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setStep("shipping")}
                          className="text-xs text-muted-foreground hover:text-white flex items-center gap-1.5 p-0 h-auto"
                        >
                          <ArrowLeft size={12} />
                          Edit Shipping
                        </Button>
                      </div>

                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={(val: any) => setPaymentMethod(val)}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className={`border rounded-2xl p-4 flex items-center gap-3 cursor-pointer select-none transition-all ${
                          paymentMethod === "card" ? "border-flownexa-lime bg-white/3" : "border-white/5 hover:border-white/10"
                        }`}>
                          <RadioGroupItem value="card" id="pay-card" className="border-white/20 data-[state=checked]:border-flownexa-lime data-[state=checked]:text-flownexa-lime" />
                          <Label htmlFor="pay-card" className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                            <CreditCard size={16} className="text-flownexa-lime" />
                            Payment With Stripe
                          </Label>
                        </div>
                        <div className={`border rounded-2xl p-4 flex items-center gap-3 cursor-pointer select-none transition-all ${
                          paymentMethod === "cod" ? "border-flownexa-lime bg-white/3" : "border-white/5 hover:border-white/10"
                        }`}>
                          <RadioGroupItem value="cod" id="pay-cod" className="border-white/20 data-[state=checked]:border-flownexa-lime data-[state=checked]:text-flownexa-lime" />
                          <Label htmlFor="pay-cod" className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                            <ShieldCheck size={16} />
                            Cash on Delivery
                          </Label>
                        </div>
                      </RadioGroup>

                      {paymentMethod === "card" && (
                        <div className="bg-flownexa-black border border-white/5 p-5 rounded-2xl flex flex-col gap-4">
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="cardNumber" className="text-xs font-semibold">Card Number</Label>
                            <Input {...register("cardNumber")} id="cardNumber" placeholder="1234567812345678" maxLength={16} className="rounded-xl bg-zinc-900 border-white/10 h-11" />
                            {errors.cardNumber && <span className="text-xs text-red-400">{errors.cardNumber.message}</span>}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                              <Label htmlFor="cardExpiry" className="text-xs font-semibold">Expiry Date (MM/YY)</Label>
                              <Input {...register("cardExpiry")} id="cardExpiry" placeholder="12/29" maxLength={5} className="rounded-xl bg-zinc-900 border-white/10 h-11" />
                              {errors.cardExpiry && <span className="text-xs text-red-400">{errors.cardExpiry.message}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label htmlFor="cardCvv" className="text-xs font-semibold">CVV Code</Label>
                              <Input {...register("cardCvv")} id="cardCvv" placeholder="123" maxLength={3} className="rounded-xl bg-zinc-900 border-white/10 h-11" />
                              {errors.cardCvv && <span className="text-xs text-red-400">{errors.cardCvv.message}</span>}
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "cod" && (
                        <div className="bg-flownexa-black border border-white/5 p-4 rounded-2xl text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="text-flownexa-lime shrink-0" />
                          <span>
                            Cash on Delivery selected. You will pay the carrier in cash once the package is delivered to your shipping address.
                          </span>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmittingOrder}
                        className="rounded-full h-12 bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover mt-4 ml-auto w-full sm:w-[180px] shadow-lg shadow-flownexa-lime/10"
                      >
                        {isSubmittingOrder ? "Placing Order..." : "Confirm & Place Order"}
                      </Button>
                    </motion.div>
                  )}

                </form>
              </div>

              <div className="lg:col-span-4 bg-zinc-900 border border-white/5 rounded-3xl p-6 flex flex-col gap-5">
                <h3 className="font-heading font-bold text-base border-b border-white/5 pb-4 flex justify-between items-center">
                  <span>Your Order</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {cart.items.reduce((acc, item) => acc + item.quantity, 0)} Items
                  </span>
                </h3>

                <div className="flex flex-col gap-3.5 divide-y divide-white/5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                  {cart.items.map((item) => (
                    <div key={`${item.product.id}-${item.selectedColor || ""}`} className="flex gap-3 pt-3 first:pt-0">
                      <div className="size-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-1 shrink-0">
                        <img src={item.product.images[0]} alt="" className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <p className="font-semibold text-xs text-white truncate">{item.product.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Qty: {item.quantity} {item.selectedColor ? `| ${item.selectedColor}` : ""}
                        </p>
                      </div>
                       <span className="text-xs font-bold text-white shrink-0">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="bg-white/5" />

                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Shipping</span>
                    <span>{cart.shipping === 0 ? "FREE" : `₹${cart.shipping.toFixed(2)}`}</span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex justify-between text-xs text-flownexa-lime">
                      <span>Discount</span>
                      <span>-₹{cart.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-white pt-3 border-t border-white/5 mt-2">
                    <span>Grand Total</span>
                    <span>₹{cart.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-white/3 border border-white/5 rounded-2xl p-4 flex gap-3 items-center mt-2 text-[10px] text-muted-foreground leading-snug">
                  <Ticket size={24} className="text-flownexa-lime shrink-0" />
                  <span>
                    Your purchase is protected by our buyer insurance and a 30-day money back guarantee.
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </PageTransition>
  );
}
