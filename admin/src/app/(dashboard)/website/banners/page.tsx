"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import MediaUploader from "@/components/shared/MediaUploader";

interface BannerRecord {
  id: string;
  name: string;
  linkUrl: string;
  scheduleDate: string;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<BannerRecord[]>([
    { id: "ban-01", name: "Summer Acoustics Sale Hero Banner", linkUrl: "/category/audio", scheduleDate: "Scheduled: July 1 - July 15" },
    { id: "ban-02", name: "VR Headsets Launch Slider", linkUrl: "/category/electronics", scheduleDate: "Active Now" },
  ]);

  const columns: Column<BannerRecord>[] = [
    {
      header: "Banner Description Name",
      accessorKey: "name",
      cell: (row) => <span className="font-bold text-white text-xs">{row.name}</span>,
      sortable: true,
    },
    {
      header: "CTA Click Redirect URL",
      accessorKey: "linkUrl",
      cell: (row) => <span className="font-mono text-[10px] text-muted-foreground">{row.linkUrl}</span>,
      sortable: true,
    },
    {
      header: "Schedule Run Dates",
      accessorKey: "scheduleDate",
      sortable: true,
    },
    {
      header: "Controls",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex gap-1.5 justify-end">
          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              setBanners(banners.filter((b) => b.id !== row.id));
              toast.success("Banner slide removed");
            }}
            className="size-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] flex items-center justify-center p-0 cursor-pointer"
          >
            <Trash2 size={12} className="text-red-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Homepage Banners Slides</h1>
          <p className="text-xs text-muted-foreground">Schedule top slideshow banners and crop thumbnail slots.</p>
        </div>
      </div>

      {/* Upload zone */}
      <div className="bg-flownexa-surface border border-white/5 p-6 rounded-3xl flex flex-col gap-3">
        <h3 className="font-heading font-bold text-sm text-white">Add Slideshow Banner Image</h3>
        <MediaUploader maxFiles={1} />
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={banners} columns={columns} searchKey="name" searchPlaceholder="Search banner slides..." />
      </div>
    </div>
  );
}
