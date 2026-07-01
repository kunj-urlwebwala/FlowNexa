"use client";

import React, { useState } from "react";
import DataTable, { Column } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { toast } from "sonner";

interface BackupRecord {
  id: string;
  name: string;
  size: string;
  date: string;
}

export default function BackupPage() {
  const [backups, setBackups] = useState<BackupRecord[]>([
    { id: "BAK-92", name: "FlowNexa_Prod_AcousticDB_Backup.sql", size: "18.5 MB", date: "Today, 02:00 AM" },
    { id: "BAK-91", name: "FlowNexa_Prod_WarehouseDB_Backup.sql", size: "12.2 MB", date: "June 29, 2026" },
  ]);

  const columns: Column<BackupRecord>[] = [
    {
      header: "Backup file name",
      accessorKey: "name",
      cell: (row) => <span className="font-mono text-xs text-white">{row.name}</span>,
      sortable: true,
    },
    {
      header: "File capacity size",
      accessorKey: "size",
      sortable: true,
    },
    {
      header: "Backup Date",
      accessorKey: "date",
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
            onClick={() => toast.success(`Downloading backup: ${row.name}`)}
            className="size-8 rounded-lg border-white/5 bg-[#1A1D26] hover:bg-[#242836] flex items-center justify-center p-0 cursor-pointer"
            title="Download SQL Dump"
          >
            <Download size={12} className="text-white" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-heading text-white">Database Backup Logs</h1>
          <p className="text-xs text-muted-foreground">Download SQL backups or schedule automatic cron backup scripts.</p>
        </div>
        <Button
          onClick={() => {
            toast.info("Triggering database backup dump...", { description: "Compiling tables..." });
            setTimeout(() => {
              setBackups([{ id: `BAK-${Date.now()}`, name: `FlowNexa_ManualDB_Backup_${Math.floor(Date.now()/1000)}.sql`, size: "14.8 MB", date: "Just Now" }, ...backups]);
              toast.success("Database Backup Completed!");
            }, 1000);
          }}
          className="rounded-full bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black font-semibold text-xs h-10 px-5 gap-1.5 shadow-lg shadow-flownexa-lime/10 cursor-pointer"
        >
          <Plus size={16} />
          Create Backup
        </Button>
      </div>

      <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
        <DataTable data={backups} columns={columns} searchKey="name" searchPlaceholder="Search backup dumps..." />
      </div>
    </div>
  );
}
