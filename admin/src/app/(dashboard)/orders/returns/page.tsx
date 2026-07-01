"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ReturnRecord {
  id: string;
  orderId: string;
  customerName: string;
  productName: string;
  reason: string;
  status: string;
}

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRecord[]>([
    { id: "RET-01", orderId: "FN-847291", customerName: "Alex Mercer", productName: "Sequoia Headphones", reason: "Slight fit issues, head band feels tight", status: "Pending" },
    { id: "RET-02", orderId: "FN-726481", customerName: "Sarah Connor", productName: "Power Bank", reason: "Color mismatched from orders", status: "Approved" },
  ]);

  const columns: Column<ReturnRecord>[] = [
    {
      header: "Return ID",
      accessorKey: "id",
      cell: (row) => <span className="font-bold text-white text-xs">{row.id}</span>,
    },
    {
      header: "Order Reference",
      accessorKey: "orderId",
      cell: (row) => <span className="font-bold text-xs">{row.orderId}</span>,
    },
    {
      header: "Product Detail",
      accessorKey: "productName",
      cell: (row) => <span className="text-xs text-white">{row.productName}</span>,
    },
    {
      header: "Customer Statement",
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
          {row.status === "Pending" && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                setReturns(returns.map((r) => r.id === row.id ? { ...r, status: "Approved" } : r));
                toast.success("Return Request Approved", { description: `Dispatched shipping returns label to ${row.customerName}.` });
              }}
              className="h-8 rounded-lg border-white/5 bg-[#1A1D26] text-emerald-400 hover:bg-[#242836] hover:text-emerald-350 text-xs px-3 cursor-pointer"
            >
              Approve Return
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
        <DataTable data={returns} columns={columns} searchKey="customerName" searchPlaceholder="Search returns..." />
      </div>
    </div>
  );
}
