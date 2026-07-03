"use client";

import React from "react";
import ChartCard from "@/components/shared/ChartCard";
import StatCard from "@/components/shared/StatCard";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from "recharts";
import { mockRevenueData, mockSalesOrdersData } from "@/data/dashboard";
import { DollarSign, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function FinancialReportsPage() {
  const handleExport = (reportType: string) => {
    toast.success(`${reportType} Exported`, {
      description: "Dispatched transaction sheets directly to CSV files.",
    });
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Financial Reports & Audits</h1>
          <p className="text-xs text-muted-foreground">Detailed breakdowns of sales revenues, operating expenses, and tax logs.</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleExport("Gross Revenue CSV")}
            className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-4 cursor-pointer"
          >
            Export Sales Sheet
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport("Tax Ledger GST")}
            className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs h-10 px-4 cursor-pointer"
          >
            Export Tax Ledger (GST)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Audited Profit" value="₹63,450" icon={DollarSign} trend={{ value: 14.2, isUp: true }} variant="highlighted" />
        <StatCard title="Operating Expenses" value="₹2,430" icon={Landmark} />
        <StatCard title="Accrued GST Reserves" value="₹11,240" icon={Landmark} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Monthly Net Profits" subtitle="Audited sales minus operating expense bases">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={mockRevenueData}>
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3E" vertical={false} />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: "#1A1D26", borderColor: "#2A2F3E", color: "#FFF", borderRadius: "12px", fontSize: "11px" }} />
              <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#profitGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Disbursed Revenue Streams" subtitle="Captures and bank payouts tracker">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mockSalesOrdersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3E" vertical={false} />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: "#1A1D26", borderColor: "#2A2F3E", color: "#FFF", borderRadius: "12px", fontSize: "11px" }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
              <Bar dataKey="sales" name="Captures" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={18} />
              <Bar dataKey="orders" name="GST Allocated" fill="#FBBF24" radius={[4, 4, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

    </div>
  );
}
