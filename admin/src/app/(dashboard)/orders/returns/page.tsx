"use client";

import React, { useState, useEffect, useCallback } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface ReturnRecord {
  id: string;
  orderId: string;
  reason: string;
  notes?: string;
  status: string;
  createdAt: string;
  order: {
    id: string;
    orderNumber: string;
    user: { name: string; email: string };
    items: { product: { name: string }; quantity: number }[];
  };
}

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReturns = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get<ReturnRecord[]>("/orders/returns");
      setReturns(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load returns");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReturns(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [fetchReturns]);

  const handleApprove = async (ret: ReturnRecord) => {
    try {
      await api.patch(`/orders/returns/${ret.id}`, { status: "APPROVED" });
      setReturns(returns.map((r) => r.id === ret.id ? { ...r, status: "APPROVED" } : r));
      toast.success("Return Approved", { description: `Return request for ${ret.order.orderNumber} approved.` });
    } catch {
      toast.error("Failed to approve return");
    }
  };

  const columns: Column<ReturnRecord>[] = [
    {
      header: "Return ID",
      accessorKey: "id",
      cell: (row) => <span className="font-bold text-white text-xs">{row.id.slice(0, 8)}...</span>,
    },
    {
      header: "Order",
      accessorKey: "order",
      cell: (row) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-xs text-white">{row.order?.orderNumber || "—"}</span>
          <span className="text-[9px] text-muted-foreground">{row.order?.user?.name || "—"}</span>
        </div>
      ),
    },
    {
      header: "Product",
      accessorKey: "order",
      cell: (row) => (
        <span className="text-xs text-white">
          {row.order?.items?.[0]?.product?.name || "—"}
          {row.order?.items?.length > 1 ? ` +${row.order.items.length - 1} more` : ""}
        </span>
      ),
    },
    {
      header: "Reason",
      accessorKey: "reason",
      cell: (row) => <span className="text-xs text-muted-foreground line-clamp-1">{row.reason}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Controls",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex gap-1.5 justify-end">
          {row.status === "PENDING" && (
            <Button variant="outline" size="xs" onClick={() => handleApprove(row)}
              className="h-8 rounded-lg border-white/5 bg-[#1A1D26] text-emerald-400 hover:bg-[#242836] text-xs px-3 cursor-pointer">
              Approve
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Returns Ledger</h1>
          <p className="text-xs text-muted-foreground">Manage returned products and inspection checks.</p>
        </div>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-flownexa-lime size-8" />
          </div>
        ) : (
          <DataTable data={returns} columns={columns} searchKey="reason" searchPlaceholder="Search returns..." />
        )}
      </div>
    </div>
  );
}
