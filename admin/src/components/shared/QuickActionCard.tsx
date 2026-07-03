"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  className?: string;
  external?: boolean;
}

export default function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
  className,
  external = false,
}: QuickActionCardProps) {
  const content = (
    <div className="flex items-start justify-between gap-4 h-full">
      <div className="flex gap-3 h-full items-start">
        {/* Left Side Icon Wrapper */}
        <div className="size-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-flownexa-lime group-hover:border-flownexa-lime/30 group-hover:bg-flownexa-lime-muted/10 transition-all shrink-0">
          <Icon size={14} />
        </div>

        {/* Center Details */}
        <div className="flex flex-col text-left justify-between h-full pt-0.5">
          <div>
            <h4 className="font-heading font-bold text-xs text-white group-hover:text-flownexa-lime transition-colors">
              {title}
            </h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed mt-1 line-clamp-2">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Up-Right Arrow Link */}
      <ArrowUpRight
        size={14}
        className="text-muted-foreground group-hover:text-flownexa-lime group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5"
      />
    </div>
  );

  const containerClasses = cn(
    "block p-4 rounded-2xl bg-flownexa-surface border border-white/5 shadow-md hover:shadow-lg hover:border-flownexa-lime/20 hover:shadow-flownexa-lime/2 transition-all duration-300 group font-sans cursor-pointer h-[84px]",
    className
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={containerClasses}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={containerClasses}>
      {content}
    </Link>
  );
}
