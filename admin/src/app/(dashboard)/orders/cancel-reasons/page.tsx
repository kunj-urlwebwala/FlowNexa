"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CancelReasonRecord {
  id: string;
  reason: string;
  category: string;
  usageCount: number;
}

export default function CancelReasonsPage() {
  const [reasons, setReasons] = useState<CancelReasonRecord[]>([
    { id: "CR-01", reason: "Found a better deal online", category: "Customer Preference", usageCount: 45 },
    { id: "CR-02", reason: "Order delivery time is too long", category: "Logistics Delay", usageCount: 22 },
    { id: "CR-03", reason: "Payment transaction errored / duplicates", category: "System Erred", usageCount: 15 },
    { id: "CR-04", reason: "Product specifications mismatch", category: "Catalogue Mismatch", usageCount: 8 },
  ]);

  const columns: Column<CancelReasonRecord>[] = [
    {
      header: "Cancellation Code",
      accessorKey: "id",
      cell: (row) => <span className="font-bold text-white text-xs">{row.id}</span>,
    },
    {
      header: "Description Statement",
      accessorKey: "reason",
      cell: (row) => <span className="text-xs text-white">{row.reason}</span>,
      sortable: true,
    },
    {
      header: "Category",
      accessorKey: "category",
      sortable: true,
    },
    {
      header: "Times Logged",
      accessorKey: "usageCount",
      cell: (row) => <span className="font-bold text-xs">{row.usageCount} times</span>,
      sortable: true,
    },
    {
      header: "Controls",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex gap-1.5 justify-end">
          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              setReasons(reasons.filter((r) => r.id !== row.id));
              toast.success("Cancel reason removed");
            }}
            className="size-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] flex items-center justify-center p-0 cursor-pointer"
          >
            <Trash2 size={12} className="text-red-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Cancellation Reasons Config</h1>
          <p className="text-xs text-muted-foreground">Define default reasons displayed to users on cancel requests.</p>
        </div>
        <Button
          onClick={() => toast.info("Creating new cancellation reason...")}
          className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
        >
          <Plus size={16} />
          Create Code
        </Button>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={reasons} columns={columns} searchKey="reason" searchPlaceholder="Search cancel reasons..." />
      </div>
    </div>
  );
}
