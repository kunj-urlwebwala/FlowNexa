"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import StatCard from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Wallet, Landmark, ArrowUpRight, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface TransactionRecord {
  id: string;
  type: string;
  amount: number;
  channel: string;
  date: string;
  status: string;
}

export default function WalletPage() {
  const [balance, setBalance] = useState(48291.5);
  const [txs, setTxs] = useState<TransactionRecord[]>([
    { id: "TXN-7412", type: "Order Secure Capture (#FN-847291)", amount: 299.0, channel: "Stripe", date: "2 mins ago", status: "Delivered" },
    { id: "TXN-7411", type: "Bank Account Settlement Payout", amount: -15000.0, channel: "Silicon Valley Bank", date: "Yesterday", status: "Delivered" },
    { id: "TXN-7410", type: "Refund Reversal Deduction (#FN-102948)", amount: -189.0, channel: "Stripe", date: "June 28, 2026", status: "Delivered" },
  ]);

  const columns: Column<TransactionRecord>[] = [
    {
      header: "Tx ID",
      accessorKey: "id",
      cell: (row) => <span className="font-bold text-white text-xs">{row.id}</span>,
    },
    {
      header: "Transaction Details",
      accessorKey: "type",
      cell: (row) => <span className="text-xs text-white">{row.type}</span>,
      sortable: true,
    },
    {
      header: "Value Adjustment",
      accessorKey: "amount",
      cell: (row) => (
        <span className={`font-bold text-xs ${row.amount > 0 ? "text-emerald-400" : "text-red-400"}`}>
          {row.amount > 0 ? "+" : ""}₹{row.amount.toLocaleString()}
        </span>
      ),
      sortable: true,
    },
    {
      header: "Channel Gate",
      accessorKey: "channel",
      sortable: true,
    },
    {
      header: "Timestamp",
      accessorKey: "date",
      sortable: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Wallet Settlement balance</h1>
          <p className="text-xs text-muted-foreground">Monitor secure captures, gateway reserves, and payout schedules.</p>
        </div>
        <Button
          onClick={() => {
            if (balance > 1000) {
              setBalance(0);
              toast.success("Payout Requested", { description: "Settling ₹48,291.50 to primary bank account." });
            }
          }}
          className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
        >
          <ArrowUpRight size={16} />
          Request Payout
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Available Balance" value={`₹${balance.toLocaleString()}`} icon={Wallet} variant="highlighted" />
        <StatCard title="Stripe Escrow Reserve" value="₹12,840" icon={DollarSign} progress={{ value: 92, label: "Reserve Limit" }} />
        <StatCard title="Last Bank Settlement" value="₹15,000" icon={Landmark} />
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={txs} columns={columns} searchKey="type" searchPlaceholder="Search transactions..." />
      </div>
    </div>
  );
}
