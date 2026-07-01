"use client";

import React from "react";
import StatCard from "@/components/shared/StatCard";
import ChartCard from "@/components/shared/ChartCard";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Sparkles, Bot, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AIReportsPage() {
  const mockPredictions = [
    { name: "Headphones", sales: 128, predicted: 145 },
    { name: "VR Headsets", sales: 94, predicted: 110 },
    { name: "Earbuds", sales: 86, predicted: 95 },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <Sparkles size={20} className="text-flownexa-lime" />
            AI Sales Predictions
          </h1>
          <p className="text-xs text-muted-foreground">Predictive analysis forecasting next month stock demands and transaction caps.</p>
        </div>
        <Button
          onClick={() => {
            toast.success("AI Synthesis Triggered", { description: "Re-evaluated warehouse ledgers and trends." });
          }}
          className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
        >
          Re-Analyze Trends
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Suggested Restocks" value="2 Bins" icon={AlertTriangle} variant="highlighted" />
        <StatCard title="Forecasted Demand" value="+18.5% Growth" icon={TrendingUp} />
        <StatCard title="Model Confidence" value="96.2%" icon={Bot} progress={{ value: 96, label: "Weights Confidence" }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Demand Forecast vs Sales" subtitle="Current sales volumes vs predicted demand thresholds">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mockPredictions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3E" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#1A1D26", borderColor: "#2A2F3E", color: "#FFF", borderRadius: "12px", fontSize: "11px" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
                <Bar dataKey="sales" name="Current Sales (Units)" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="predicted" name="Predicted Demand (Next Month)" fill="#E1FF4B" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="bg-flownexa-surface border border-white/5 p-6 rounded-3xl flex flex-col gap-4">
          <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">AI Insights</h3>
          <div className="text-xs text-muted-foreground leading-relaxed flex flex-col gap-3">
            <p>💡 <strong>Acoustics Category:</strong> High purchase spikes predicted in July due to summer vacation events. Stock Sequoia headphones up to 145 units.</p>
            <p>⚠️ <strong>Stock Depletion Alert:</strong> Power Bank inventories will hit critical threshold in 4 days. Approved PO recommended.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
