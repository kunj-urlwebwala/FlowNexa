"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
interface LedgerRecord {
  id: string;
  productName: string;
  type: string;
  adjustment: string;
  operator: string;
  timestamp: string;
  warehouse: string;
}

export default function StockLedgerPage() {
  const [logs] = useState<LedgerRecord[]>([
    { id: "LOG-5810", productName: "Sequoia Headphones", type: "Restock Fulfillment", adjustment: "+50 Units", operator: "Alex Mercer", timestamp: "June 30, 09:30 AM", warehouse: "SF Logistics" },
    { id: "LOG-5809", productName: "X-Buds Pro Wireless", type: "Fulfillment Allocation", adjustment: "-2 Units", operator: "System Dispatcher", timestamp: "June 29, 04:00 PM", warehouse: "NY East Hub" },
    { id: "LOG-5808", productName: "Orizon VR Headset", type: "Fulfillment Allocation", adjustment: "-1 Unit", operator: "System Dispatcher", timestamp: "June 29, 08:30 PM", warehouse: "SF Logistics" },
    { id: "LOG-5807", productName: "Flow Power Bank", type: "Damaged Scrapped", adjustment: "-1 Unit", operator: "Alex Mercer", timestamp: "June 28, 11:15 AM", warehouse: "Chicago Midwest" },
  ]);

  const columns: Column<LedgerRecord>[] = [
    {
      header: "Log ID",
      accessorKey: "id",
      cell: (row) => <span className="font-bold text-white text-xs">{row.id}</span>,
      sortable: true,
    },
    {
      header: "Product Affected",
      accessorKey: "productName",
      cell: (row) => <span className="text-xs text-white">{row.productName}</span>,
      sortable: true,
    },
    {
      header: "Ledger Event",
      accessorKey: "type",
      sortable: true,
    },
    {
      header: "Adjustment Value",
      accessorKey: "adjustment",
      cell: (row) => (
        <span className={`font-bold text-xs ${row.adjustment.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>
          {row.adjustment}
        </span>
      ),
    },
    {
      header: "Warehouse",
      accessorKey: "warehouse",
      sortable: true,
    },
    {
      header: "Operator / System",
      accessorKey: "operator",
      sortable: true,
    },
    {
      header: "Timestamp",
      accessorKey: "timestamp",
      sortable: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Stock Ledger Trail</h1>
          <p className="text-xs text-muted-foreground">Historical records of all inventory additions, subtractions, and adjustments.</p>
        </div>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={logs} columns={columns} searchKey="productName" searchPlaceholder="Search ledger logs..." />
      </div>
    </div>
  );
}
