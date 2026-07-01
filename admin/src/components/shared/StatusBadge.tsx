"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Clock, Truck, ShieldAlert, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase().replace(/_/g, " ");

  let config = {
    color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/25",
    icon: Clock,
    label: status,
  };

  switch (normalized) {
    // Success states
    case "active":
    case "delivered":
    case "paid":
    case "won":
    case "closed won":
    case "approved":
    case "in stock":
    case "resolved":
      config = {
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
        icon: CheckCircle2,
        label: status,
      };
      break;

    // Info / In-progress states
    case "shipped":
    case "processing":
    case "placed":
    case "confirmed":
    case "packed":
    case "contacted":
    case "proposal":
      config = {
        color: "text-blue-400 bg-blue-500/10 border-blue-500/25",
        icon: Truck,
        label: status,
      };
      break;

    // Warning / Pending states
    case "pending":
    case "low stock":
    case "draft":
    case "new":
    case "in progress":
      config = {
        color: "text-amber-400 bg-amber-500/10 border-amber-500/25",
        icon: Clock,
        label: status,
      };
      break;

    // Danger / Error states
    case "cancelled":
    case "failed":
    case "failed delivery":
    case "lost":
    case "closed lost":
    case "out of stock":
    case "quarantined":
    case "quarantine":
    case "damaged":
    case "rejected":
    case "closed":
      config = {
        color: "text-red-400 bg-red-500/10 border-red-500/25",
        icon: XCircle,
        label: status,
      };
      break;

    // Default other
    default:
      config = {
        color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/25",
        icon: AlertCircle,
        label: status,
      };
      break;
  }

  const StatusIcon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold uppercase tracking-wider select-none shrink-0",
        config.color,
        className
      )}
    >
      <StatusIcon size={11} className="shrink-0" />
      <span>{config.label}</span>
    </div>
  );
}
