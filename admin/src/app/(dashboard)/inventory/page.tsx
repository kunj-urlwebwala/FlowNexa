"use client";

import React from "react";
import StatCard from "@/components/shared/StatCard";
import ChartCard from "@/components/shared/ChartCard";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { mockWarehouseDistribution } from "@/data/dashboard";
import { Warehouse, AlertTriangle, RefreshCw, AlertCircle, TrendingUp, History } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/shared/StatusBadge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function InventoryDashboard() {
  const mockStockMovements = [
    { id: "M-102", product: "Sequoia Headphones", type: "Restock", qty: "+50", date: "10 mins ago", status: "Approved" },
    { id: "M-101", product: "X-Buds Pro", type: "Order Allocation", qty: "-2", date: "1 hour ago", status: "Resolved" },
    { id: "M-100", product: "Power Bank", type: "Damaged Scrap", qty: "-1", date: "3 hours ago", status: "Quarantined" },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Inventory Control Hub</h1>
          <p className="text-xs text-muted-foreground">Monitor warehouse allocations, restock queues, and ledger logs.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Stock Units" value="12,450" icon={Warehouse} progress={{ value: 45, label: "Warehouse Capacity" }} />
        <StatCard title="Low Stock Items" value="3 Products" icon={AlertTriangle} trend={{ value: 2, isUp: false }} />
        <StatCard title="Restock Requests" value="4 Pending" icon={RefreshCw} progress={{ value: 25, label: "Approval rate" }} />
        <StatCard title="Quarantined Stock" value="1 Unit" icon={AlertCircle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Capacity Chart (2/3 width) */}
        <div className="lg:col-span-2">
          <ChartCard title="Warehouse Space Allocation" subtitle="Current filled cubic capacity by region">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockWarehouseDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3E" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: "#1A1D26", borderColor: "#2A2F3E", color: "#FFF", borderRadius: "12px", fontSize: "11px" }} />
                <Bar dataKey="value" name="Filled Capacity %" fill="#E1FF4B" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Quick links shortcuts (1/3 width) */}
        <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl flex flex-col gap-3">
          <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">Inventory Logs</h3>
          <div className="flex flex-col gap-2">
            <Link href="/inventory/stocks">
              <Button variant="outline" className="w-full justify-start text-xs border-white/5 bg-[#1A1D26] hover:bg-[#242836] h-10 rounded-xl cursor-pointer">
                📦 Manage Product Stocks
              </Button>
            </Link>
            <Link href="/inventory/ledger">
              <Button variant="outline" className="w-full justify-start text-xs border-white/5 bg-[#1A1D26] hover:bg-[#242836] h-10 rounded-xl cursor-pointer">
                📑 View Stock Ledger
              </Button>
            </Link>
            <Link href="/inventory/restock">
              <Button variant="outline" className="w-full justify-start text-xs border-white/5 bg-[#1A1D26] hover:bg-[#242836] h-10 rounded-xl cursor-pointer">
                🔄 Restock Requests Queue
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Movements ledger (Table) */}
      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl flex flex-col gap-4">
        <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">Recent Movements Trail</h3>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/5 hover:bg-transparent">
              <TableHead className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Log ID</TableHead>
              <TableHead className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Product</TableHead>
              <TableHead className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Movement Type</TableHead>
              <TableHead className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Adjustment</TableHead>
              <TableHead className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Date</TableHead>
              <TableHead className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockStockMovements.map((mov) => (
              <TableRow key={mov.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <TableCell className="text-xs font-bold text-white">{mov.id}</TableCell>
                <TableCell className="text-xs text-white">{mov.product}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{mov.type}</TableCell>
                <TableCell className={`text-xs font-bold ${mov.qty.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>{mov.qty}</TableCell>
                <TableCell className="text-[10px] text-muted-foreground">{mov.date}</TableCell>
                <TableCell className="py-2"><StatusBadge status={mov.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}
