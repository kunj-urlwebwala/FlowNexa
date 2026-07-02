"use client";

import React, { useState } from "react";
import Timeline from "@/components/shared/Timeline";
import { Activity } from "lucide-react";

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([
    { title: "Product catalog created", timestamp: "10 mins ago", isCompleted: true, description: "Super Admin created Seiko Acoustics product listing." },
    { title: "Bank checking payout settled", timestamp: "3 hours ago", isCompleted: true, description: "Transferred ₹15,000 to Silicon Valley checking node." },
    { title: "API integration modified", timestamp: "Yesterday", isCompleted: true, description: "Stripe webhook secret tokens updated." },
  ]);

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <Activity size={24} className="text-flownexa-lime" />
            Operator Audit logbook
          </h1>
          <p className="text-xs text-muted-foreground">Historical ledger auditing all system adjustments, catalog changes, and payouts.</p>
        </div>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-6 rounded-3xl">
        <Timeline items={logs} />
      </div>
    </div>
  );
}
