"use client";

import { use, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, MapPin, ClipboardList, Mail, Phone, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface UserAddress {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface UserOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
}

interface UserDetailRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  addresses?: UserAddress[];
  orders?: UserOrder[];
  createdAt: string;
}

export default function UserDetailPage(props: PageProps) {
  const params = use(props.params);
  const [userRecord, setUserRecord] = useState<UserDetailRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const data = await api.get<UserDetailRecord>(`/users/${params.id}`);
        setUserRecord(data);
      } catch {
        toast.error("Failed to load user profile details");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-flownexa-black text-white min-h-[400px] flex flex-col items-center justify-center text-center p-6 font-sans">
        <Loader2 className="animate-spin text-flownexa-lime size-8 mb-2" />
        <p className="text-xs text-muted-foreground">Retrieving profile database details...</p>
      </div>
    );
  }

  if (!userRecord) {
    return (
      <div className="bg-flownexa-black text-white min-h-[400px] flex flex-col items-center justify-center text-center p-6 font-sans">
        <h2 className="text-xl font-bold font-heading mb-2">User Not Discovered</h2>
        <p className="text-sm text-muted-foreground mb-6">
          The requested user ID does not exist in our system.
        </p>
        <Link href="/users">
          <Button className="rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover">
            Return to User Database
          </Button>
        </Link>
      </div>
    );
  }

  const joinedDate = new Date(userRecord.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      
      {/* Top Navigation */}
      <div className="flex justify-between items-center select-none">
        <Link href="/users">
          <Button variant="outline" size="sm" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs gap-1.5 cursor-pointer">
            <ArrowLeft size={14} />
            Back to Users
          </Button>
        </Link>
        <span className="text-[9px] bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-full text-muted-foreground font-extrabold uppercase">
          Client Profile Details
        </span>
      </div>

      {/* User Header Profile */}
      <div className="bg-flownexa-surface border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="flex gap-4 items-center">
          <div className="size-16 rounded-2xl bg-flownexa-lime flex items-center justify-center text-flownexa-black text-2xl font-extrabold shadow-lg shadow-flownexa-lime/10">
            {userRecord.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white font-heading">{userRecord.name}</h2>
              <StatusBadge status={userRecord.isActive ? "Active" : "Inactive"} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{userRecord.email}</p>
          </div>
        </div>

        <div className="flex gap-5 divide-x divide-white/5 border-t md:border-t-0 pt-4 md:pt-0 w-full md:w-auto text-left">
          <div className="flex-1 pr-5">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Access Role</p>
            <p className="text-sm font-bold text-white mt-0.5">Customer</p>
          </div>
          <div className="flex-1 pl-5">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Member Since</p>
            <p className="text-sm font-bold text-white mt-0.5">{joinedDate}</p>
          </div>
        </div>
      </div>

      {/* Details Area with Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-[#1A1D26] border border-white/5 p-1 rounded-2xl flex justify-start gap-1 w-full sm:w-auto h-auto select-none overflow-x-auto no-scrollbar">
          <TabsTrigger value="overview" className="rounded-xl px-4 py-2 text-xs font-semibold data-[state=active]:bg-flownexa-lime data-[state=active]:text-flownexa-black cursor-pointer">
            <User size={13} className="mr-1.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="addresses" className="rounded-xl px-4 py-2 text-xs font-semibold data-[state=active]:bg-flownexa-lime data-[state=active]:text-flownexa-black cursor-pointer">
            <MapPin size={13} className="mr-1.5" />
            Addresses ({userRecord.addresses?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="orders" className="rounded-xl px-4 py-2 text-xs font-semibold data-[state=active]:bg-flownexa-lime data-[state=active]:text-flownexa-black cursor-pointer">
            <ClipboardList size={13} className="mr-1.5" />
            Orders ({userRecord.orders?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Overview Panel */}
        <TabsContent value="overview" className="mt-4">
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl p-6">
            <CardContent className="p-0 flex flex-col gap-6 text-left">
              <h3 className="font-heading font-bold text-white text-sm">Account Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Email Address</p>
                    <p className="text-xs font-semibold text-white mt-0.5">{userRecord.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Contact Phone</p>
                    <p className="text-xs font-semibold text-white mt-0.5">{userRecord.phone || "Not Configured"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Registration Timestamp</p>
                    <p className="text-xs font-semibold text-white mt-0.5">{joinedDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Panel */}
        <TabsContent value="addresses" className="mt-4">
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl p-6">
            <CardContent className="p-0 flex flex-col gap-4 text-left">
              <h3 className="font-heading font-bold text-white text-sm">Stored Shipping Profiles</h3>
              {!userRecord.addresses || userRecord.addresses.length === 0 ? (
                <p className="text-xs text-muted-foreground">No physical shipping addresses stored.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userRecord.addresses.map((addr) => (
                    <div key={addr.id} className="border border-white/5 rounded-2xl p-4 bg-zinc-900/50">
                      <p className="text-xs font-bold text-white mb-1">{addr.fullName}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {addr.addressLine1} {addr.addressLine2 && `, ${addr.addressLine2}`}
                        <br />
                        {addr.city}, {addr.state} {addr.zipCode}
                        <br />
                        {addr.country}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Panel */}
        <TabsContent value="orders" className="mt-4">
          <Card className="bg-flownexa-surface border-white/5 rounded-3xl p-6">
            <CardContent className="p-0 flex flex-col gap-4 text-left">
              <h3 className="font-heading font-bold text-white text-sm">Purchase Invoices History</h3>
              {!userRecord.orders || userRecord.orders.length === 0 ? (
                <p className="text-xs text-muted-foreground">This customer has not placed any orders yet.</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {userRecord.orders.map((ord) => (
                    <div key={ord.id} className="flex justify-between items-center border border-white/5 rounded-2xl p-4 bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
                      <div className="flex flex-col">
                        <Link href={`/orders/${ord.id}`} className="text-xs font-bold text-white hover:text-flownexa-lime transition-colors">
                          {ord.orderNumber}
                        </Link>
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-white">${ord.total.toFixed(2)}</span>
                        <StatusBadge status={ord.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
