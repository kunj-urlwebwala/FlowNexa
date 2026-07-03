"use client";

import type { ComponentType } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ComponentType<{ size?: number; className?: string }>;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = AlertCircle,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-white/10 rounded-2xl bg-zinc-950/20 font-sans">
      <div className="size-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mb-4">
        <Icon size={20} className="text-muted-foreground" />
      </div>

      <h3 className="font-heading font-bold text-sm text-white mb-1.5">
        {title}
      </h3>

      <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mb-6">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover shadow-lg shadow-flownexa-lime/10 text-xs px-4"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
