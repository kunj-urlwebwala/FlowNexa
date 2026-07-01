"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { mockAdminProducts, AdminProductRecord } from "@/data/admin-products";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Edit3 } from "lucide-react";

interface StockRow extends AdminProductRecord {
  batchNo: string;
  mfgDate: string;
  expDate: string;
}

export default function ProductStocksPage() {
  const [stocks, setStocks] = useState<StockRow[]>(
    mockAdminProducts.map((p, idx) => ({
      ...p,
      batchNo: `BT-00${idx + 1}`,
      mfgDate: "Jan 10, 2026",
      expDate: "Jan 10, 2028",
    }))
  );

  const columns: Column<StockRow>[] = [
    {
      header: "Product Detail",
      accessorKey: "name",
      cell: (row) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-white text-xs">{row.name}</span>
          <span className="text-[9px] font-mono text-muted-foreground">{row.sku}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Batch No",
      accessorKey: "batchNo",
      cell: (row) => <span className="font-mono text-xs">{row.batchNo}</span>,
      sortable: true,
    },
    {
      header: "Warehouse",
      accessorKey: "warehouse",
      sortable: true,
    },
    {
      header: "Manufacturing / Expiry",
      accessorKey: "mfgDate",
      cell: (row) => (
        <div className="flex flex-col text-left text-[10px] text-muted-foreground">
          <span>MFG: {row.mfgDate}</span>
          <span>EXP: {row.expDate}</span>
        </div>
      ),
    },
    {
      header: "Quantity available",
      accessorKey: "stock",
      cell: (row) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-xs">{row.stock} Units</span>
          <span className="text-[9px] text-muted-foreground">Min: {row.minStock} | Max: {row.maxStock}</span>
        </div>
      ),
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
              toast.info(`Editing stock counts for ${row.name}`);
            }}
            className="h-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] text-xs px-3.5 cursor-pointer"
          >
            <Edit3 size={12} className="mr-1.5" />
            Edit Stock
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Product Stock Levels</h1>
          <p className="text-xs text-muted-foreground">Manage precise batch numbers, manufacturing/expiry dates and warehouse bins.</p>
        </div>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={stocks} columns={columns} searchKey="name" searchPlaceholder="Search product stocks..." />
      </div>
    </div>
  );
}
