"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DamagedRecord {
  id: string;
  productName: string;
  qty: number;
  warehouse: string;
  damageReason: string;
  status: string;
}

export default function DamagedStockPage() {
  const [damaged, setDamaged] = useState<DamagedRecord[]>([
    { id: "DMG-01", productName: "Flow Power Bank", qty: 1, warehouse: "Chicago Midwest", damageReason: "Li-ion battery swell during inspection", status: "Quarantined" },
    { id: "DMG-02", productName: "Sequoia Headphones", qty: 2, warehouse: "SF Logistics Center", damageReason: "Cosmetic scratches on shipping boxes", status: "Rejected" },
  ]);

  const columns: Column<DamagedRecord>[] = [
    {
      header: "Scrap Code",
      accessorKey: "id",
      cell: (row) => <span className="font-bold text-white text-xs">{row.id}</span>,
    },
    {
      header: "Product Affected",
      accessorKey: "productName",
      cell: (row) => <span className="text-xs text-white">{row.productName}</span>,
      sortable: true,
    },
    {
      header: "Scrap Qty",
      accessorKey: "qty",
      cell: (row) => <span className="font-bold text-xs">{row.qty} Units</span>,
      sortable: true,
    },
    {
      header: "Warehouse Location",
      accessorKey: "warehouse",
      sortable: true,
    },
    {
      header: "Damage Diagnosis Reason",
      accessorKey: "damageReason",
      cell: (row) => <span className="text-xs text-muted-foreground line-clamp-1">{row.damageReason}</span>,
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
          {row.status === "Quarantined" && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                setDamaged(damaged.map((d) => d.id === row.id ? { ...d, status: "Rejected" } : d));
                toast.success("Stock Scrapped Permanently", { description: "Adjusted database inventory totals." });
              }}
              className="h-8 rounded-lg border-white/5 bg-[#1A1D26] text-red-400 hover:bg-[#242836] hover:text-red-355 text-xs px-3.5 cursor-pointer"
            >
              Confirm Scrap Write-off
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
          <h1 className="text-2xl font-bold font-heading text-white">Quarantine & Damaged Bins</h1>
          <p className="text-xs text-muted-foreground">Manage damaged stock and execute structural write-offs.</p>
        </div>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={damaged} columns={columns} searchKey="productName" searchPlaceholder="Search quarantined items..." />
      </div>
    </div>
  );
}
