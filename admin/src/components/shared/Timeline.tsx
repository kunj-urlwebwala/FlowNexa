"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Clock } from "lucide-react";

interface TimelineItem {
  title: string;
  description?: string;
  timestamp: string;
  isCompleted?: boolean;
  icon?: any;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export default function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("flex flex-col gap-6 font-sans select-none", className)}>
      {items.map((item, index) => {
        const isCompleted = item.isCompleted ?? true;
        const ItemIcon = item.icon || (isCompleted ? CheckCircle2 : Clock);
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex gap-4 relative">
            {/* Connecting Vertical Line */}
            {!isLast && (
              <div
                className={cn(
                  "absolute left-4.5 top-9 bottom-[-24px] w-0.5",
                  isCompleted && (items[index + 1].isCompleted ?? true)
                    ? "bg-[#E1FF4B]"
                    : "bg-white/5"
                )}
              />
            )}

            {/* Timeline Circle / Icon */}
            <div
              className={cn(
                "size-9 rounded-full border flex items-center justify-center shrink-0 z-10",
                isCompleted
                  ? "bg-flownexa-lime-muted border-flownexa-lime text-flownexa-lime"
                  : "bg-zinc-900 border-white/10 text-muted-foreground"
              )}
            >
              <ItemIcon size={16} />
            </div>

            {/* Content Details */}
            <div className="flex-1 text-left pt-1.5 pb-2 border-b border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <h4
                  className={cn(
                    "text-xs font-bold",
                    isCompleted ? "text-white" : "text-muted-foreground"
                  )}
                >
                  {item.title}
                </h4>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {item.timestamp}
                </span>
              </div>
              {item.description && (
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
