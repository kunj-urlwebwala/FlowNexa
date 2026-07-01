"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SubscriberRecord {
  id: string;
  email: string;
  subscribedDate: string;
}

export default function NewsletterSubscribersPage() {
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>([
    { id: "sub-1", email: "alex@mercer.com", subscribedDate: "June 25, 2026" },
    { id: "sub-2", email: "sarah@connor.com", subscribedDate: "June 20, 2026" },
    { id: "sub-3", email: "bruce@wayne.com", subscribedDate: "June 18, 2026" },
  ]);

  const columns: Column<SubscriberRecord>[] = [
    {
      header: "Subscriber Email Address",
      accessorKey: "email",
      cell: (row) => <span className="font-bold text-white text-xs">{row.email}</span>,
      sortable: true,
    },
    {
      header: "Registration Stamp",
      accessorKey: "subscribedDate",
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
              setSubscribers(subscribers.filter((s) => s.id !== row.id));
              toast.success("Subscriber removed successfully");
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
          <h1 className="text-2xl font-bold font-heading text-white">Newsletter Subscriptions</h1>
          <p className="text-xs text-muted-foreground">Monitor and manage email newsletter subscribers directory.</p>
        </div>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={subscribers} columns={columns} searchKey="email" searchPlaceholder="Search subscribers..." />
      </div>
    </div>
  );
}
