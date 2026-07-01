"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface RefundRecord {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  status: string;
}

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<RefundRecord[]>([
    { id: "RFD-01", orderId: "FN-847291", customerName: "Alex Mercer", amount: 299.0, paymentMethod: "Credit Card", status: "Pending" },
    { id: "RFD-02", orderId: "FN-102948", customerName: "Diana Prince", amount: 189.0, paymentMethod: "Credit Card", status: "Resolved" },
  ]);

  const columns: Column<RefundRecord>[] = [
    {
      header: "Refund ID",
      accessorKey: "id",
      cell: (row) => <span className="font-bold text-white text-xs">{row.id}</span>,
    },
    {
      header: "Order Ref",
      accessorKey: "orderId",
      cell: (row) => <span className="font-bold text-xs">{row.orderId}</span>,
    },
    {
      header: "Recipient Client",
      accessorKey: "customerName",
      cell: (row) => <span className="text-xs text-white">{row.customerName}</span>,
    },
    {
      header: "Refunding Amount",
      accessorKey: "amount",
      cell: (row) => <span className="font-bold text-xs text-flownexa-lime">${row.amount.toFixed(2)}</span>,
    },
    {
      header: "Refund Channel",
      accessorKey: "paymentMethod",
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
                setRefunds(refunds.map((r) => r.id === row.id ? { ...r, status: "Resolved" } : r));
                toast.success("Refund Processed", { description: `Returned $${row.amount} to original payment credit card.` });
              }}
              className="h-8 rounded-lg border-white/5 bg-[#1A1D26] text-emerald-400 hover:bg-[#242836] hover:text-emerald-350 text-xs px-3 cursor-pointer"
            >
              Process Refund
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
          <h1 className="text-2xl font-bold font-heading text-white">Refunds Control Ledger</h1>
          <p className="text-xs text-muted-foreground">Approve, deny, or monitor transaction reversals.</p>
        </div>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={refunds} columns={columns} searchKey="customerName" searchPlaceholder="Search refunds..." />
      </div>
    </div>
  );
}
