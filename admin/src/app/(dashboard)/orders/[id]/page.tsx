"use client";

import { use, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Printer, Ship, FileText, CheckCircle2, User, Mail, Phone, MapPin, Loader2, Activity } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";
import Timeline from "@/components/shared/Timeline";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface OrderDetailRecord {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  shippingAddress: any;
  user: any;
  items: any[];
  createdAt: string;
}

export default function OrderDetailPage(props: PageProps) {
  const params = use(props.params);
  const [orderRecord, setOrderRecord] = useState<OrderDetailRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [carrier, setCarrier] = useState("DHL Express");

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await api.get<OrderDetailRecord>(`/orders/${params.id}`);
      setOrderRecord(data);
    } catch (err: any) {
      toast.error("Failed to load order invoice details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-flownexa-black text-white min-h-[400px] flex flex-col items-center justify-center text-center p-6 font-sans">
        <Loader2 className="animate-spin text-flownexa-lime size-8 mb-2" />
        <p className="text-xs text-muted-foreground">Retrieving order invoice details...</p>
      </div>
    );
  }

  if (!orderRecord) {
    return (
      <div className="bg-flownexa-black text-white min-h-[400px] flex flex-col items-center justify-center text-center p-6 font-sans">
        <h2 className="text-xl font-bold font-heading mb-2">Order Not Discovered</h2>
        <p className="text-sm text-muted-foreground mb-6">
          The requested transaction ID does not exist in our system logs.
        </p>
        <Link href="/orders">
          <Button className="rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover">
            Return to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const triggerPrint = (docType: string) => {
    toast.success(`Printing ${docType}`, {
      description: `Dispatched print command for Order ${orderRecord.orderNumber}.`,
    });
  };

  const createdDate = new Date(orderRecord.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate dynamic tracking steps based on Order status
  const trackingTimeline = [
    {
      title: "Order Placed",
      timestamp: createdDate,
      isCompleted: true,
      icon: CheckCircle2,
    },
    {
      title: "Payment Processing",
      timestamp: orderRecord.paymentStatus === "PAID" ? "Completed" : "Awaiting Authorization",
      isCompleted: orderRecord.paymentStatus === "PAID" || orderRecord.paymentMethod === "COD",
      icon: Activity,
    },
    {
      title: "Cargo Dispatched",
      timestamp: orderRecord.status === "SHIPPED" || orderRecord.status === "DELIVERED" ? "In Transit" : "Queueing",
      isCompleted: orderRecord.status === "SHIPPED" || orderRecord.status === "DELIVERED",
      icon: Ship,
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      
      {/* Top Header Controls */}
      <div className="flex justify-between items-center select-none">
        <Link href="/orders">
          <Button variant="outline" size="sm" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs gap-1.5 cursor-pointer">
            <ArrowLeft size={14} />
            Back to Orders
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerPrint("Sales Invoice")}
            className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs gap-1.5 cursor-pointer"
          >
            <Printer size={13} />
            Print Invoice
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerPrint("Shipping Label")}
            className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs gap-1.5 cursor-pointer"
          >
            <Ship size={13} />
            Shipping Label
          </Button>
        </div>
      </div>

      {/* Main split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Order items list, timeline history (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Order Details Header */}
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-white font-heading">Order {orderRecord.orderNumber}</h2>
                  <StatusBadge status={orderRecord.status} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Placed on {createdDate}</p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Grand Total</p>
                <p className="text-xl font-heading font-black text-flownexa-lime mt-0.5">
                  ${orderRecord.total.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Items Purchased List */}
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2 mb-4">
                Items Purchased
              </h3>
              <div className="flex flex-col gap-4">
                {orderRecord.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center justify-between bg-white/2 border border-white/5 p-4 rounded-2xl">
                    <div className="flex gap-4 items-center">
                      <div className="size-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1.5 overflow-hidden shrink-0">
                        <Loader2 className="animate-spin text-muted-foreground/30 size-4 absolute" />
                        <span className="size-full text-[10px] bg-white/5 text-white/50 flex items-center justify-center text-center font-bold">FN</span>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-white">{item.productName}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          SKU: {item.sku}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-xs text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Qty: {item.quantity} × ${item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline Tracking */}
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2 mb-5">
                Fulfillment Journey Timeline
              </h3>
              <Timeline items={trackingTimeline} />
            </CardContent>
          </Card>

        </div>

        {/* Right Side: Customer info, shipping address, logistics details (1/3 width) */}
        <div className="flex flex-col gap-6">
          
          {/* Customer info card */}
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2 flex items-center gap-1.5">
                <User size={14} className="text-flownexa-lime" />
                Customer Account
              </h3>
              <div className="flex flex-col gap-2.5 text-xs text-muted-foreground">
                <div>
                  <span className="font-semibold text-white block">Full Name:</span>
                  <span>{orderRecord.user?.name || "Guest Customer"}</span>
                </div>
                <div>
                  <span className="font-semibold text-white block">Email Address:</span>
                  <span>{orderRecord.user?.email || "guest@flownexa.com"}</span>
                </div>
                <div>
                  <span className="font-semibold text-white block">Payment Type:</span>
                  <span>{orderRecord.paymentMethod} ({orderRecord.paymentStatus})</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2 flex items-center gap-1.5">
                <MapPin size={14} className="text-flownexa-lime" />
                Shipping Destination
              </h3>
              <div className="text-xs text-muted-foreground leading-relaxed">
                <p className="font-bold text-white mb-0.5">{orderRecord.shippingAddress?.fullName}</p>
                <p>{orderRecord.shippingAddress?.street}</p>
                <p>{orderRecord.shippingAddress?.city}, {orderRecord.shippingAddress?.state} {orderRecord.shippingAddress?.postalCode}</p>
                <p>{orderRecord.shippingAddress?.country}</p>
              </div>
            </CardContent>
          </Card>

          {/* Logistics Assign */}
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2 flex items-center gap-1.5">
                <FileText size={14} className="text-flownexa-lime" />
                Logistics Carrier Assignment
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Select Carrier Partner</span>
                  <Select value={carrier} onValueChange={setCarrier}>
                    <SelectTrigger className="bg-[#1A1D26] border-white/5 text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1D26] border border-white/5 text-white text-xs font-sans">
                      <SelectItem value="DHL Express">DHL Express (Acoustic Air Cargo)</SelectItem>
                      <SelectItem value="FedEx Ground">FedEx Ground (Standard Parcel)</SelectItem>
                      <SelectItem value="UPS Air Premium">UPS Air Premium (Express Delivery)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={async () => {
                    try {
                      await api.patch(`/orders/${orderRecord.id}/status`, { status: "SHIPPED" });
                      toast.success(`Carrier updated — pickup scheduled for ${orderRecord.orderNumber} via ${carrier}.`);
                      loadOrder(); // reload
                    } catch (err: any) {
                      toast.error("Failed to assign carrier");
                    }
                  }}
                  className="w-full rounded-xl bg-flownexa-lime text-flownexa-black font-semibold text-xs h-9 cursor-pointer"
                >
                  Confirm Cargo Booking
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
}
