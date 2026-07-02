"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Truck, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemsSummary: string;
  total: number;
  paymentMethod: string;
  createdDate: string;
  status: string;
}

export default function OrdersListPage() {
  const [ordersList, setOrdersList] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "shipped" | "delivered" | "cancelled">("all");

  const fetchedRef = useRef(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.get<any[]>("/orders");
      
      const mapped: OrderRecord[] = data.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.user?.name || "Guest Customer",
        customerEmail: o.user?.email || "guest@flownexa.com",
        itemsSummary: (o.items || []).map((i: any) => `${i.productName} (x${i.quantity})`).join(", "),
        total: o.total,
        paymentMethod: o.paymentMethod,
        createdDate: new Date(o.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        status: o.status,
      }));

      setOrdersList(mapped);
    } catch (err: any) {
      toast.error(err.message || "Failed to load orders list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    switch (activeTab) {
      case "pending":
        return ordersList.filter((o) => o.status === "PROCESSING" || o.status === "PENDING");
      case "shipped":
        return ordersList.filter((o) => o.status === "SHIPPED");
      case "delivered":
        return ordersList.filter((o) => o.status === "DELIVERED");
      case "cancelled":
        return ordersList.filter((o) => o.status === "CANCELLED");
      default:
        return ordersList;
    }
  }, [ordersList, activeTab]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders(); // reload
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const columns: Column<OrderRecord>[] = [
    {
      header: "Order Number",
      accessorKey: "orderNumber",
      cell: (row) => <span className="font-bold text-white text-xs">{row.orderNumber}</span>,
      sortable: true,
    },
    {
      header: "Customer",
      accessorKey: "customerName",
      cell: (row) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-white text-xs">{row.customerName}</span>
          <span className="text-[9px] text-muted-foreground">{row.customerEmail}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Items Ordered",
      accessorKey: "itemsSummary",
      cell: (row) => (
        <span className="text-xs text-white max-w-[200px] truncate block" title={row.itemsSummary}>
          {row.itemsSummary}
        </span>
      ),
    },
    {
      header: "Total Amount",
      accessorKey: "total",
      cell: (row) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-xs text-flownexa-lime">₹{row.total.toFixed(2)}</span>
          <span className="text-[9px] text-muted-foreground">{row.paymentMethod}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Placed Date",
      accessorKey: "createdDate",
      sortable: true,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
      sortable: true,
    },
    {
      header: "Controls",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex gap-1.5 justify-end">
          <Link href={`/orders/${row.id}`}>
            <Button
              variant="outline"
              size="xs"
              className="size-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] flex items-center justify-center p-0 cursor-pointer"
              title="View Invoice Details"
            >
              <Eye size={12} className="text-white" />
            </Button>
          </Link>
          {row.status === "PENDING" && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => handleUpdateStatus(row.id, "PROCESSING")}
              className="size-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] flex items-center justify-center p-0 cursor-pointer text-blue-400"
              title="Process Order"
            >
              <Truck size={12} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const bulkActions = [
    {
      label: "Mark As Shipped",
      action: async (items: OrderRecord[]) => {
        try {
          for (const item of items) {
            await api.patch(`/orders/${item.id}/status`, { status: "SHIPPED" });
          }
          toast.success("Selected orders marked as SHIPPED");
          fetchOrders();
        } catch (err: any) {
          toast.error("Failed to ship some orders", { description: err.message });
        }
      },
      icon: Truck,
      variant: "outline" as const,
    },
    {
      label: "Cancel Selected",
      action: async (items: OrderRecord[]) => {
        try {
          for (const item of items) {
            await api.patch(`/orders/${item.id}/status`, { status: "CANCELLED" });
          }
          toast.success("Selected orders CANCELLED");
          fetchOrders();
        } catch (err: any) {
          toast.error("Failed to cancel some orders", { description: err.message });
        }
      },
      icon: XCircle,
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Title block */}
      <div className="flex justify-between items-center text-left select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Order Control Ledger</h1>
          <p className="text-xs text-muted-foreground">
            Monitor and fulfill incoming customer purchases, refund orders, and log returns.
          </p>
        </div>
        <span className="text-[9px] bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-full text-muted-foreground font-extrabold uppercase">
          Fulfillment Registry
        </span>
      </div>

      {/* Tabs selector */}
      <div className="flex border-b border-white/5 select-none overflow-x-auto no-scrollbar">
        {[
          { id: "all", label: "Total Orders", count: ordersList.length },
          { id: "pending", label: "Pending & Processing", count: ordersList.filter((o) => o.status === "PROCESSING" || o.status === "PENDING").length },
          { id: "shipped", label: "Shipped Queue", count: ordersList.filter((o) => o.status === "SHIPPED").length },
          { id: "delivered", label: "Delivered Archive", count: ordersList.filter((o) => o.status === "DELIVERED").length },
          { id: "cancelled", label: "Cancelled", count: ordersList.filter((o) => o.status === "CANCELLED").length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 text-xs font-bold transition-all relative cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "text-flownexa-lime"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <span className="flex items-center gap-1.5">
              {tab.label}
              <Badge className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${
                activeTab === tab.id
                  ? "bg-flownexa-lime text-flownexa-black"
                  : "bg-white/5 border border-white/5 text-muted-foreground"
              }`}>
                {tab.count}
              </Badge>
            </span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-flownexa-lime" />
            )}
          </button>
        ))}
      </div>

      {/* Table grid layout */}
      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl min-h-[200px] flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            <Loader2 className="animate-spin text-flownexa-lime size-6" />
            <span className="text-xs text-muted-foreground">Syncing orders ledger with database...</span>
          </div>
        ) : (
          <DataTable
            data={filteredOrders}
            columns={columns}
            searchKey="customerName"
            searchPlaceholder="Search orders by customer name..."
            bulkActions={bulkActions}
          />
        )}
      </div>

    </div>
  );
}
