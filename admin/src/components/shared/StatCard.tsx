"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  trend?: {
    value: number;
    isUp: boolean;
  };
  progress?: {
    value: number; // e.g., 82 for 82%
    max?: number;
    label?: string;
  };
  variant?: "default" | "highlighted"; // default (dark bg), highlighted (lime bg like reference)
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  progress,
  variant = "default",
  className,
}: StatCardProps) {
  const isHighlight = variant === "highlighted";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 font-sans flex flex-col justify-between shadow-lg transition-shadow duration-300",
        isHighlight
          ? "bg-flownexa-lime text-flownexa-black border-flownexa-lime/20 shadow-flownexa-lime/5"
          : "bg-flownexa-surface text-white border-white/5 shadow-black/30",
        className
      )}
    >
      {/* Glow highlight effect */}
      {isHighlight && (
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-white to-transparent" />
      )}

      {/* Top row: Title and Icon */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <span
          className={cn(
            "text-[10px] font-extrabold uppercase tracking-wider",
            isHighlight ? "text-flownexa-black/60" : "text-muted-foreground"
          )}
        >
          {title}
        </span>
        <div
          className={cn(
            "size-8 rounded-xl flex items-center justify-center border",
            isHighlight
              ? "bg-flownexa-black/5 border-flownexa-black/10 text-flownexa-black"
              : "bg-white/5 border-white/10 text-muted-foreground"
          )}
        >
          <Icon size={14} />
        </div>
      </div>

      {/* Center Value */}
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold font-heading tracking-tight leading-none">
          {value}
        </h3>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-0.5 text-[9px] font-extrabold rounded-full px-1.5 py-0.5 border",
              trend.isUp
                ? isHighlight
                  ? "text-emerald-950 bg-emerald-500/20 border-emerald-500/10"
                  : "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
                : isHighlight
                ? "text-red-950 bg-red-500/20 border-red-500/10"
                : "text-red-400 bg-red-500/10 border-red-500/25"
            )}
          >
            {trend.isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>

      {/* Bottom Progress Metrics (inspired by reference UI) */}
      {progress && (
        <div className="mt-4 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[9px] font-bold">
            <span className={isHighlight ? "text-flownexa-black/60" : "text-muted-foreground"}>
              {progress.label || "Utilization"}
            </span>
            <span>
              {progress.value}% {progress.max ? `/ ${progress.max}` : ""}
            </span>
          </div>

          {/* Styled progress bar matching the rounded block chunks in reference */}
          <div className="flex gap-0.5 h-3 items-center">
            {Array.from({ length: 10 }).map((_, idx) => {
              const isActive = progress.value >= (idx + 1) * 10;
              return (
                <div
                  key={idx}
                  className={cn(
                    "flex-1 h-2 rounded-full transition-all duration-300",
                    isActive
                      ? isHighlight
                        ? "bg-flownexa-black"
                        : "bg-flownexa-lime"
                      : isHighlight
                      ? "bg-flownexa-black/10"
                      : "bg-white/10"
                  )}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
