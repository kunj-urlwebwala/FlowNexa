"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown } from "lucide-react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  filterLabel?: string;
  onFilterChange?: (filter: string) => void;
  filters?: string[];
}

export default function ChartCard({
  title,
  subtitle,
  children,
  filterLabel = "Last 30 Days",
  onFilterChange,
  filters = ["Last 7 Days", "Last 30 Days", "Last 6 Months", "This Year"],
}: ChartCardProps) {
  const [activeFilter, setActiveFilter] = React.useState(filterLabel);

  const handleSelect = (filter: string) => {
    setActiveFilter(filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  return (
    <Card className="bg-[#1A1D26] border-white/5 shadow-black/30 rounded-2xl overflow-hidden font-sans">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 pb-2">
        <div className="flex flex-col gap-1 text-left">
          <CardTitle className="text-sm font-bold text-white font-heading">
            {title}
          </CardTitle>
          {subtitle && (
            <CardDescription className="text-[10px] text-muted-foreground">
              {subtitle}
            </CardDescription>
          )}
        </div>

        {onFilterChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] text-[10px] font-semibold uppercase tracking-wider gap-1.5 cursor-pointer"
              >
                <Calendar size={12} className="text-muted-foreground" />
                <span>{activeFilter}</span>
                <ChevronDown size={11} className="text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1A1D26] border border-white/5 text-white rounded-xl font-sans">
              {filters.map((f) => (
                <DropdownMenuItem
                  key={f}
                  onClick={() => handleSelect(f)}
                  className="text-xs hover:bg-white/5 cursor-pointer"
                >
                  {f}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent className="p-5 pt-0">
        <div className="w-full min-h-[250px] relative mt-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
